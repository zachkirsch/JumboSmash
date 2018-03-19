import { put, call, takeEvery, takeLatest } from 'redux-saga/effects'
import { firebase } from '../firebase'
import {
  MatchesActionType,
  AttemptSendMessagesAction,
  SendMessagesSuccessAction,
  SendMessagesFailureAction,
  FetchAllUsersSuccessAction,
  FetchAllUsersFailureAction,
  AttemptSwipeAction,
  CreateMatchAction,
} from './actions'
import { GiftedChatMessage } from './types'
import { api, GetAllUsersResponse, SwipeResponse } from '../api'

function* attemptSendMessages(action: AttemptSendMessagesAction) {
  function pushMessagetoFirebase(message: GiftedChatMessage) {
    return new Promise(resolve => {
      const path = 'messages/'.concat(action.conversationId)
      const dbRef = firebase.database().ref(path)
      dbRef.push({
        ...message,
        createdAt: message.createdAt.getTime(), // convert Date to number for firebase
      }, resolve)
    })
  }

  for (let i = 0; i < action.messages.length; i++) {
    const message = action.messages[i]
    const error: Error = yield call(pushMessagetoFirebase, message)
    if (error) {
      const failureAction: SendMessagesFailureAction = {
        type: MatchesActionType.SEND_MESSAGES_FAILURE,
        conversationId: action.conversationId,
        messages: [message],
        errorMessage: error.message,
      }
      yield put(failureAction)
    } else {
      const successAction: SendMessagesSuccessAction = {
        type: MatchesActionType.SEND_MESSAGES_SUCCESS,
        conversationId: action.conversationId,
        messages: [message],
      }
      yield put(successAction)
    }
  }
}

function* attemptFetchUsers() {
  try {
    const users: GetAllUsersResponse = yield call(api.getAllUsers)
    const successAction: FetchAllUsersSuccessAction = {
      type: MatchesActionType.FETCH_ALL_USERS_SUCCESS,
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
      type: MatchesActionType.FETCH_ALL_USERS_FAILURE,
      errorMessage: e.message,
    }
    yield put(failureAction)
  }
}

function* attemptSwipe(action: AttemptSwipeAction) {
  try {
    const response: SwipeResponse = yield call(api.swipe, action.direction, action.onUser.id)
    // TODO: handle swipe success

    if (response.matched) {
      const matchAction: CreateMatchAction = {
        type: MatchesActionType.CREATE_MATCH,
        conversationId: response.match.conversation_uuid,
        onUser: action.onUser,
      }
      yield put(matchAction)
    }
  } catch (e) {
    // TODO: handle swipe error
  }
}

export function* matchesSaga() {
  yield takeEvery(MatchesActionType.ATTEMPT_SEND_MESSAGES, attemptSendMessages)
  yield takeLatest(MatchesActionType.ATTEMPT_FETCH_ALL_USERS, attemptFetchUsers)
  yield takeEvery(MatchesActionType.ATTEMPT_SWIPE, attemptSwipe)
}
