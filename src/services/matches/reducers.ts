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
  chats: Map<string, Conversation>({
    2: {
      conversationId: '2',
      otherUsers: List([{
        id: 1,
        preferredName: 'Zach Kirsch',
        bio: 'Gotta catch em all',
        images: ['https://scontent.fzty2-1.fna.fbcdn.net/v/t31.0-8/17039378_10212402239837389_66' +
        '23819361607561120_o.jpg?oh=da5905077fe2f7ab636d9e7ac930133c&oe=5B113366'],
        tags: ['tag1', 'tag2'],
      }]),
      messages: List([
        {
          _id: 0,
          text: 'This is Zach',
          createdAt: new Date(),
          user: {
            _id: 1,
            name: 'Zach Kirsch',
            avatar: 'https://scontent.fzty2-1.fna.fbcdn.net/v/t31.0-8/17039378_10212402239837389_66' +
                    '23819361607561120_o.jpg?oh=da5905077fe2f7ab636d9e7ac930133c&oe=5B113366',
          },
          sending: false,
          failedToSend: false,
          sent: true,
          received: true,
          read: false,
        },
      ]),
      messageIDs: Set([0]),
      mostRecentMessage: 'This is Zach',
      messagesUnread: true,
    },
  }),
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
    conversationId: originalConversation.conversationId,
    otherUsers: originalConversation.otherUsers.asImmutable(),
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
    conversationId: originalConversation.conversationId,
    otherUsers: originalConversation.otherUsers.asImmutable(),
    messages: newMessages,
    messageIDs: originalConversation.messageIDs.asImmutable(),
    mostRecentMessage: originalConversation.mostRecentMessage,
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
      return {
        chats: state.chats.set(action.conversationId, {
          conversationId: action.conversationId,
          otherUsers: List([{
            id: action.onUser.id,
            preferredName: action.onUser.preferredName,
            avatar: action.onUser.images[0],
            bio: action.onUser.bio,
            images: action.onUser.images,
            tags: action.onUser.tags,
          }]),
          messages: List(),
          messageIDs: Set(),
          mostRecentMessage: '',
          messagesUnread: false,
        }),
      }

    // this is a separate case because redux-persist stores immutables as plain JS
    case ReduxActionType.REHYDRATE:

      // for unit tests when root state is empty
      if (!action.payload.matches) {
        return state
      }

      let chats = Map<string, Conversation>()
      Object.keys(action.payload.matches.chats).forEach((conversationId) => {
        /* tslint:disable-next-line:no-any */
        const originalConversation: Conversation = (action.payload.matches.chats as any)[conversationId]
        const conversation: Conversation = {
          conversationId,
          otherUsers: List(originalConversation.otherUsers),
          messages: List(originalConversation.messages.map((message) => {
            return {
              ...message,
              sending: false,
              failedToSend: !!message && (message.sending || message.failedToSend),
            }
          })),
          messageIDs: Set(originalConversation.messageIDs),
          mostRecentMessage: originalConversation.mostRecentMessage,
          messagesUnread: originalConversation.messagesUnread,
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
