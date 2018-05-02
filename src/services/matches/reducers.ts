import { List, Map, Set } from 'immutable'
import {
  AttemptSendMessagesAction,
  MatchesAction,
  MatchesActionType,
  ReceiveMessagesAction,
  SendMessagesFailureAction,
  SendMessagesSuccessAction,
} from './actions'
import { ReduxActionType } from '../redux'
import { Conversation, MatchesState } from './types'

const initialState: MatchesState = {
  chats: Map<string, Conversation>(),
}

const addMessagesToReduxState = (oldState: MatchesState,
                                 action: AttemptSendMessagesAction | ReceiveMessagesAction,
                                 sending: boolean) => {

  const originalConversation = oldState.chats.get(action.conversationId)
  if (!originalConversation) {
    return oldState
  }

  let newMessages = originalConversation.messages.asImmutable()
  let newMessageIDs = originalConversation.messageIDs.asImmutable()
  action.messages.forEach((message) => {
    if (!newMessageIDs.contains(message._id)) {
      newMessageIDs = newMessageIDs.add(message._id)
      newMessages = newMessages.unshift({
        ...message,
        failedToSend: false,
        sending,
      })
    }
  })

  const newConversation: Conversation = {
    ...originalConversation,
    messages: newMessages,
    messageIDs: newMessageIDs,
    mostRecentMessage: newMessages.first().text,
    messagesUnread: newMessages.size > originalConversation.messages.size,
  }

  return {
    chats: oldState.chats.set(action.conversationId, newConversation),
  }
}

const updateSentStatus = (oldState: MatchesState,
                          action: SendMessagesSuccessAction | SendMessagesFailureAction,
                          success: boolean) => {

  const originalConversation = oldState.chats.get(action.conversationId)
  if (!originalConversation) {
    return oldState
  }

  let newMessages = originalConversation.messages.asImmutable()
  action.messages.forEach((message) => {
    if (originalConversation.messageIDs.contains(message._id)) {
      newMessages = newMessages.update(
        newMessages.findIndex((messageInList) => !!messageInList && messageInList._id === message._id),
        (messageInList) => ({
          ...messageInList,
          sending: false,
          failedToSend: !success,
        })
      )
    }
  })

  const newConversation: Conversation = {
    ...originalConversation,
    messages: newMessages,
    messagesUnread: false,
  }

  return {
    chats: oldState.chats.set(action.conversationId, newConversation),
  }
}

export function matchesReducer(state = initialState, action: MatchesAction): MatchesState {
  switch (action.type) {

    case MatchesActionType.RECEIVE_MESSAGES:
      return addMessagesToReduxState(state, action, false)

    case MatchesActionType.ATTEMPT_SEND_MESSAGES:
      return addMessagesToReduxState(state, action, true)

    case MatchesActionType.SEND_MESSAGES_SUCCESS:
      return updateSentStatus(state, action, true)

    case MatchesActionType.SEND_MESSAGES_FAILURE:
      return updateSentStatus(state, action, false)

    case MatchesActionType.SET_CONVERSATION_AS_READ:
      let newConversation = state.chats.get(action.conversationId)
      return {
        chats: state.chats.set(action.conversationId, {
          ...newConversation,
          messagesUnread: false,
        }),
      }

    case MatchesActionType.CREATE_MATCH:
      if (state.chats.has(action.conversationId)) {
        return state
      }
      return {
        chats: state.chats.set(action.conversationId, {
          matchId: action.id,
          conversationId: action.conversationId,
          createdAt: action.createdAt,
          otherUsers: action.otherUsers.map(user => user.id),
          messages: List(),
          messageIDs: Set(),
          mostRecentMessage: '',
          messagesUnread: false,
        }),
      }

    case MatchesActionType.REHYDRATE_MATCHES_FROM_SERVER:
      let chats = state.chats
      action.matches.forEach(match => {
        if (!chats.has(match.conversationId)) {
          chats = chats.set(match.conversationId, {
            matchId: match.id,
            conversationId: match.conversationId,
            otherUsers: match.otherUsers.map(user => user.id),
            messages: List(),
            messageIDs: Set(),
            mostRecentMessage: '',
            createdAt: match.createdAt,
            messagesUnread: false,
          })
        }
      })
      chats.keySeq().forEach(conversationId => {
        if (conversationId && !action.matches.find(match => match.conversationId === conversationId)) {
          chats = chats.remove(conversationId)
        }
      })
      return {
        chats,
      }

    case MatchesActionType.UNMATCH:
      return {
        chats: state.chats.remove(action.conversationId),
      }

    case ReduxActionType.REHYDRATE:

      // for unit tests when root state is empty
      if (!action.payload.matches) {
        return state
      }

      chats = Map<string, Conversation>()
      Object.keys(action.payload.matches.chats).forEach((conversationId) => {
        /* tslint:disable-next-line:no-any */
        const originalConversation: Conversation = (action.payload.matches.chats as any)[conversationId]
        const conversation: Conversation = {
          conversationId,
          ...originalConversation,
          messages: List(originalConversation.messages.map((message) => {
            return {
              ...message,
              sending: false,
              failedToSend: !!message && (message.sending || message.failedToSend),
            }
          })),
          messageIDs: Set(originalConversation.messageIDs),
        }
        chats = chats.set(conversationId, conversation)
      })
      return {
        ...state,
        chats,
      }

    case MatchesActionType.CLEAR_MATCHES_STATE:
      return {
        ...initialState,
      }

    default:
      return state
  }
}
