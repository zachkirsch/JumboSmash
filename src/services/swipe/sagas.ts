import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { api, GetAllUsersResponse, SwipeResponse } from '../api'
import { ChatService } from '../firebase/utils'
import {
  AttemptSwipeAction,
  SwipeSuccessAction,
  SwipeFailureAction,
  AttemptFetchAllUsersAction,
  FetchAllUsersFailureAction,
  FetchAllUsersSuccessAction,
  SwipeActionType,
} from './actions'
import { shuffle } from '../../utils'
import { ReduxActionType, RehydrateAction } from '../redux'
import { Tag } from '../profile'

const TAGS: Tag[] = [
  { id: 0, name: '🏳️‍🌈', emoji: true },
  { id: 1, name: '👫', emoji: true },
  { id: 2, name: '👬', emoji: true },
  { id: 3, name: '👭', emoji: true },
  { id: 4, name: 'taken af' },
  { id: 5, name: 'single af' },
  { id: 6, name: 'open relationship' },
  { id: 7, name: 'poly' },
  { id: 8, name: 'complicated' },
  { id: 9, name: 'married' },
  { id: 10, name: 'single' },
  { id: 11, name: "it's cuffing szn" },
  { id: 12, name: 'one night stands' },
  { id: 13, name: 'I do CS' },
  { id: 14, name: "can't afford a relationship" },
  { id: 15, name: 'here for the memes' },
]

function* attemptFetchUsers(_: AttemptFetchAllUsersAction | RehydrateAction) {

  try {
    const users: GetAllUsersResponse = yield call(api.getAllUsers)
    const successAction: FetchAllUsersSuccessAction = {
      type: SwipeActionType.FETCH_ALL_USERS_SUCCESS,
      users: users.users[0].filter(user => user.images.find(image => !!image.url)).map(user => ({
        id: user.id,
        bio: user.bio,
        major: user.major,
        preferredName: user.preferred_name,
        surname: user.surname,
        fullName: user.full_name,
        images: user.images.map((image) => image.url),
        tags: Array.from(shuffle(TAGS)),
      })),
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

    if (response.matched) {
      ChatService.createChat(response.match.conversation_uuid, [action.onUser])
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

export function* swipeSaga() {
  yield takeLatest(SwipeActionType.ATTEMPT_FETCH_ALL_USERS, attemptFetchUsers)
  yield takeEvery(SwipeActionType.ATTEMPT_SWIPE, attemptSwipe)
  yield takeLatest(ReduxActionType.REHYDRATE, attemptFetchUsers)
}
