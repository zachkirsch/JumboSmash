import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import moment from 'moment'
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
} from './actions'
import { ReduxActionType } from '../redux'
import { RootState } from '../../redux'
import { EmojiProfileReact, ProfileReact, ImageProfileReact, EMOJI_REGEX } from '../profile'
import { User } from './types'

const getAllReacts = (state: RootState) => state.profile.reacts.value
const getId = (state: RootState) => state.profile.id

const convertServerUserToUser = (allReacts: ProfileReact[], user: GetUserResponse): User => {
  return {
    id: user.id,
    bio: user.bio,
    major: user.major || '',
    preferredName: user.preferred_name || '',
    surname: user.surname,
    fullName: user.full_name,
    images: user.images.map(image => image.url),
    tags: user.tags.map(tag => ({
      name: tag.text,
      emoji: !tag.text.match(EMOJI_REGEX),
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
    const response: SwipeResponse = yield call(api.swipe, action.direction, action.onUser.id)

    const myID = yield select(getId)

    if (response.matched) {
      ChatService.createChat(
        response.match.id,
        response.match.conversation_uuid,
        moment(response.match.createdAt).valueOf(),
        response.match.users.filter(u => u.id !== myID),
        false,
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

function* attemptReact(action: AttemptReactAction) {
  try {
    yield call(api.react, action.onUser.id, action.reacts.map(r => r.id))
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

export function* swipeSaga() {
  yield takeLatest(SwipeActionType.ATTEMPT_FETCH_SWIPABLE_USERS, attemptFetchSwipableUsers)
  yield takeLatest(SwipeActionType.ATTEMPT_FETCH_ALL_USERS, attemptFetchAllUsers)
  yield takeEvery(SwipeActionType.ATTEMPT_SWIPE, attemptSwipe)
  yield takeEvery(SwipeActionType.ATTEMPT_REACT, attemptReact)
  yield takeLatest(ReduxActionType.REHYDRATE, attemptFetchSwipableUsers)
}
