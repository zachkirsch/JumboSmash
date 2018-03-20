import { put, call, takeEvery } from 'redux-saga/effects'
import { getRefToChatMessages } from '../firebase'
import {
  MatchesActionType,
  AttemptSendMessagesAction,
  SendMessagesSuccessAction,
  SendMessagesFailureAction,
} from './actions'
import { GiftedChatMessage } from './types'

function* attemptSendMessages(action: AttemptSendMessagesAction) {
  function pushMessagetoFirebase(message: GiftedChatMessage) {
    return new Promise(resolve => {
      const dbRef = getRefToChatMessages(action.conversationId)
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

export function* matchesSaga() {
  yield takeEvery(MatchesActionType.ATTEMPT_SEND_MESSAGES, attemptSendMessages)
}
