import { call, put, select, takeEvery } from 'redux-saga/effects'
import { getRefToChatMessages } from '../firebase'
import {
  AttemptSendMessagesAction,
  MatchesActionType,
  SendMessagesFailureAction,
  SendMessagesSuccessAction,
  UnmatchAction,
} from './actions'
import { IChatMessage } from 'react-native-gifted-chat'
import { api } from '../api'
import { RootState } from '../../redux'

const getOtherUsersInChat = (conversationId: string) => {
  return (state: RootState) => state.matches.chats.get(conversationId).otherUsers
}

function* attemptSendMessages(action: AttemptSendMessagesAction) {
  function pushMessagetoFirebase(message: IChatMessage) {
    return new Promise((resolve, reject) => {
      const dbRef = getRefToChatMessages(action.conversationId)
      dbRef.push({
        ...message,
      }, error => error ? reject(error) : resolve())
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
      try {
        const otherUsers: number[] = yield select(getOtherUsersInChat(action.conversationId))
        yield call(api.sendChat, otherUsers, message.text)
      } catch (e) {} /* tslint:disable-line:no-empty */
      const successAction: SendMessagesSuccessAction = {
        type: MatchesActionType.SEND_MESSAGES_SUCCESS,
        conversationId: action.conversationId,
        messages: [message],
      }
      yield put(successAction)
    }
  }
}

function* unmatch(payload: UnmatchAction) {
  try {
    yield call(api.unmatch, payload.matchId)
  } catch (e) {} /* tslint:disable-line:no-empty */
}

export function* matchesSaga() {
  yield takeEvery(MatchesActionType.ATTEMPT_SEND_MESSAGES, attemptSendMessages)
  yield takeEvery(MatchesActionType.UNMATCH, unmatch)
}
