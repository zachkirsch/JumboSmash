import { put, call, takeEvery, takeLatest } from 'redux-saga/effects'
import {
  SwipeActionType,
  FetchAllUsersSuccessAction,
  FetchAllUsersFailureAction,
  AttemptSwipeAction,
} from './actions'
import { MatchesActionType, CreateMatchAction } from '../matches'
import { createChat } from '../firebase'
import { api, GetAllUsersResponse, SwipeResponse } from '../api'

function* attemptFetchUsers() {
  try {
    const users: GetAllUsersResponse = yield call(api.getAllUsers)
    const successAction: FetchAllUsersSuccessAction = {
      type: SwipeActionType.FETCH_ALL_USERS_SUCCESS,
      users: users.users[0].map(user => ({
        id: user.id,
        bio: user.bio,
        preferredName: user.preferred_name,
        images: user.images.map(image => image.url),
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
    // TODO: handle swipe success (as action)

    if (response.matched) {

      // create chat in firebase
      createChat(response.match.conversation_uuid)

      // create the match
      const matchAction: CreateMatchAction = {
        type: MatchesActionType.CREATE_MATCH,
        conversationId: response.match.conversation_uuid,
        onUser: action.onUser,
      }
      yield put(matchAction)
    }
  } catch (e) {
    // TODO: handle swipe error (as action)
  }
}

export function* swipeSaga() {
  yield takeLatest(SwipeActionType.ATTEMPT_FETCH_ALL_USERS, attemptFetchUsers)
  yield takeEvery(SwipeActionType.ATTEMPT_SWIPE, attemptSwipe)
}
