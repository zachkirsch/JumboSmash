import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import firebase from 'react-native-firebase'
import { api, GetUserResponse, GetAllUsersUser, GetAllUsersResponse, GetSwipableUsersResponse, SwipeResponse } from '../api'
import { ChatService } from '../firebase/utils'
import {
  AttemptSwipeAction,
  SwipeSuccessAction,
  SwipeFailureAction,
  AttemptReactAction,
  ReactSuccessAction,
  ReactFailureAction,
  FetchAllUsersFailureAction,
  FetchAllUsersSuccessAction,
  FetchSwipableUsersFailureAction,
  FetchSwipableUsersSuccessAction,
  SwipeActionType,
  fetchSwipableUsers,
} from './actions'
import { ReduxActionType } from '../redux'
import { RootState } from '../../redux'
import { EmojiProfileReact, ProfileReact, ImageProfileReact } from '../profile'
import { User } from './types'
import { addInAppNotification, setNotificationsToken } from '../notifications/actions'

const getAllReacts = (state: RootState) => state.profile.profileReacts.value
const getId = (state: RootState) => state.profile.id
const getSignedInStatus = (state: RootState) => state.auth.loggedIn.value
const getAllUsers = (state: RootState) => state.swipe.allUsers.value.toObject()

const convertServerUserToUser = (allReacts: ProfileReact[], user: GetUserResponse): User => {
  return {
    id: user.id,
    firebaseUid: user.firebase_uid,
    email: user.email,
    bio: user.bio,
    major: user.major || '',
    preferredName: user.preferred_name || '',
    surname: user.surname,
    fullName: user.full_name,
    classYear: user.class_year,
    images: user.images.map(image => image.url),
    tags: user.tags.map(tag => ({
      name: tag.text,
      emoji: tag.type === 'emoji',
    })),
    profileReacts: {
      value: allReacts.map(react => {
        if (react.type === 'emoji') {
          const profileReact = user.profile_reacts.find(r => r.react_id === react.id)
          const emojiReact: EmojiProfileReact = {
            ...react,
            count: profileReact ? profileReact.react_count : 0,
          }
          return emojiReact
        } else {
          const profileReact = user.profile_reacts.find(r => r.react_id === react.id)
          const imageReact: ImageProfileReact = {
            ...react,
            count: profileReact ? profileReact.react_count : 0,
          }
          return imageReact
        }
      }),
      loading: false,
    },
  }
}

const convertServerUserToUserWithReacts = (allReacts: ProfileReact[], user: GetAllUsersUser) => {
  const updateReacted = (react: ProfileReact) => ({
      ...react,
      reacted: !!user.my_reacts.find(r => r.react_id === react.id),
  })
  const convertedUser = convertServerUserToUser(allReacts, user)
  convertedUser.profileReacts.value = convertedUser.profileReacts.value.map(updateReacted)
  return convertedUser
}

function* attemptFetchSwipableUsers() {
  try {
    const allUsers: GetAllUsersResponse = yield call(api.getAllUsers)
    const swipableUsers: GetSwipableUsersResponse = yield call(api.getSwipableUsers)
    const allReacts: ProfileReact[] = yield select(getAllReacts)
    const successAction: FetchSwipableUsersSuccessAction = {
      type: SwipeActionType.FETCH_SWIPABLE_USERS_SUCCESS,
      swipableUsers: swipableUsers.users.map(u => u.id),
      allUsers: allUsers.users.map(user => convertServerUserToUserWithReacts(allReacts, user)),
    }
    yield put(successAction)
  } catch (e) {
  const failureAction: FetchSwipableUsersFailureAction = {
    type: SwipeActionType.FETCH_SWIPABLE_USERS_FAILURE,
    errorMessage: e.message,
  }
    yield put(failureAction)
  }

  // as a weird workaround to tokens not being refreshed,
  // set it every time we fetch more users
  try {
    const token: string = yield firebase.messaging().getToken()
    yield put(setNotificationsToken(token))
  } catch (e) {} /* tslint:disable-line:no-empty */
}

function* attemptFetchAllUsers() {
  try {
    const users: GetAllUsersResponse = yield call(api.getAllUsers)
    const allReacts: ProfileReact[] = yield select(getAllReacts)
    const successAction: FetchAllUsersSuccessAction = {
      type: SwipeActionType.FETCH_ALL_USERS_SUCCESS,
      users: users.users.map(user => convertServerUserToUserWithReacts(allReacts, user)),
    }
    yield put(successAction)
  } catch (e) {
    const failureAction: FetchAllUsersFailureAction = {
      type: SwipeActionType.FETCH_ALL_USERS_FAILURE,
      errorMessage: e.message,
    }
    yield put(failureAction)
  }
}

function* attemptSwipe(action: AttemptSwipeAction) {
  try {
    const response: SwipeResponse = yield call(api.swipe, action.direction, action.onUser)

    const myID = yield select(getId)

    if (response.matched) {
      ChatService.createChat(
        response.match.id,
        response.match.conversation_uuid,
        response.match.createdAt,
        response.match.users.map(u => u.id).filter(id => id !== myID),
        true
      )
    }

    const successAction: SwipeSuccessAction = {
      type: SwipeActionType.SWIPE_SUCCESS,
      direction: action.direction,
      onUser: action.onUser,
    }
    yield put(successAction)

  } catch (e) {
    const failureAction: SwipeFailureAction = {
      type: SwipeActionType.SWIPE_FAILURE,
      direction: action.direction,
      onUser: action.onUser,
      errorMessage: e.message,
    }
    yield put(failureAction)
  }
}

function* swipeFailure(action: SwipeFailureAction) {
  const allUsers: {[userId: number]: User} = yield select(getAllUsers)
  const user = allUsers[action.onUser]
  const message = user ? `Your swipe on ${user.fullName} failed` : 'Your swipe failed'
  yield put(addInAppNotification({
    type: 'actionless',
    title: message,
    subtitle: 'Check your network connection',
  }))

}

function* attemptReact(action: AttemptReactAction) {
  try {
    yield call(api.react, action.onUser, action.reacts.map(r => r.id))
    const successAction: ReactSuccessAction = {
      type: SwipeActionType.REACT_SUCCESS,
      onUser: action.onUser,
    }
    yield put(successAction)
  } catch (e) {
    const failureAction: ReactFailureAction = {
      type: SwipeActionType.REACT_FAILURE,
      onUser: action.onUser,
      errorMessage: e.message,
    }
    yield put(failureAction)
  }
}

function* rehydateUsers() {
  const isLoggedIn: boolean = yield select(getSignedInStatus)
  if (isLoggedIn) {
    yield put(fetchSwipableUsers())
  }
}

export function* swipeSaga() {
  yield takeLatest(SwipeActionType.ATTEMPT_FETCH_SWIPABLE_USERS, attemptFetchSwipableUsers)
  yield takeLatest(SwipeActionType.ATTEMPT_FETCH_ALL_USERS, attemptFetchAllUsers)
  yield takeEvery(SwipeActionType.ATTEMPT_SWIPE, attemptSwipe)
  yield takeEvery(SwipeActionType.SWIPE_FAILURE, swipeFailure)
  yield takeEvery(SwipeActionType.ATTEMPT_REACT, attemptReact)
  yield takeLatest(ReduxActionType.REHYDRATE, rehydateUsers)
}
