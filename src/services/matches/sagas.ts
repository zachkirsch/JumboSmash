import { call, put, select, takeEvery } from 'redux-saga/effects'
import { getRefToChatMessages } from '../firebase'
import {
  AttemptSendMessagesAction,
  MatchesActionType,
  SendMessagesFailureAction,
  SendMessagesSuccessAction,
  RehydrateMatchesFromServerAction,
  UnmatchAction,
  RemoveChatAction,
} from './actions'
import { ChatService } from '../firebase'
import { ChatMessage, Conversation } from './types'
import { api } from '../api'
// import { ChatService } from '../firebase'
import { RootState } from '../../redux'

const getConversation = (conversationId: string) => {
  return (state: RootState) => state.matches.chats.get(conversationId)
}

function* attemptSendMessages(action: AttemptSendMessagesAction) {
  function pushMessagetoFirebase(message: ChatMessage) {
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
        const conversation: Conversation = yield select(getConversation(action.conversationId))
        yield call(api.sendChat, conversation.otherUsers, message.text, conversation.matchId)
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

function rehydrateMatchesFromServer(payload: RehydrateMatchesFromServerAction) {
  payload.matches.forEach(match => ChatService.listenForNewChats(match.conversationId))
}

function removeChat(payload: RemoveChatAction) {
  ChatService.stopListeningToChat(payload.conversationId)
}

function* unmatch(payload: UnmatchAction) {
  try {
    ChatService.stopListeningToChat(payload.conversationId)
    yield call(api.unmatch, payload.matchId)
  } catch (e) {} /* tslint:disable-line:no-empty */
}

export function* matchesSaga() {
  yield takeEvery(MatchesActionType.ATTEMPT_SEND_MESSAGES, attemptSendMessages)
  yield takeEvery(MatchesActionType.REHYDRATE_MATCHES_FROM_SERVER, rehydrateMatchesFromServer)
  yield takeEvery(MatchesActionType.REMOVE_CHAT, removeChat)
  yield takeEvery(MatchesActionType.UNMATCH, unmatch)
}
