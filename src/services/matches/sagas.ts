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
import { RootState } from '../../redux'

const gifRegex = /^\/gif\s(.*)$/

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
  function retrieveGif(query: string) {
    const apiKey = 'avovzjZaC19qaKeXMr6DzSgNm1YQvepz'
    const apiUrl = 'http://api.giphy.com/v1/gifs/random'

    const queryParams = {
      api_key: apiKey,
      rating: 'r',
      tag: query.split('/gif')[1]
    }

    let queryUrl = apiUrl + '?tag=' + queryParams.tag +
      '&api_key=' + queryParams.api_key +
      '&rating=' + queryParams.rating

    let gifUrl = fetch(queryUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(parsedData) {
        return parsedData.data.images && parsedData.data.images.fixed_height.url;
      })
    return gifUrl
  }
  for (let i = 0; i < action.messages.length; i++) {
    const message = action.messages[i]
    try {
      if (message.text.match(gifRegex)) {
        message.image = yield call(retrieveGif, message.text)
      }
      yield call(pushMessagetoFirebase, message)
      const successAction: SendMessagesSuccessAction = {
        type: MatchesActionType.SEND_MESSAGES_SUCCESS,
        conversationId: action.conversationId,
        messages: [message],
      }
      yield put(successAction)
    } catch (e) {
      const failureAction: SendMessagesFailureAction = {
        type: MatchesActionType.SEND_MESSAGES_FAILURE,
        conversationId: action.conversationId,
        messages: [message],
        errorMessage: e.message,
      }
      yield put(failureAction)
    }
    try {
      const conversation: Conversation = yield select(getConversation(action.conversationId))
      yield call(api.sendChat, conversation.otherUsers, message.text, conversation.matchId)
    } catch (e) {} /* tslint:disable-line:no-empty */
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
