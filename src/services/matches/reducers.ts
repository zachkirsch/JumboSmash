import { Map, List } from 'immutable'
import { MatchesActionType, MatchesAction } from './actions'
import { MatchesState, Conversation } from './types'

const initialState: MatchesState = {
  chats: Map<string, Conversation>({
    '1': {
      conversationId: '1',
      otherUsers: List([{
        _id: 0,
        name: 'Greg Aloupis',
        avatar: 'http://www.cs.tufts.edu/people/faculty/images/GregAloupis.png',
      }]),
      messages: List([
        {
          _id: 0,
          text: 'This is Greg',
          createdAt: new Date(),
          user: {
            _id: 0,
            name: 'Greg Aloupis',
            avatar: 'http://www.cs.tufts.edu/people/faculty/images/GregAloupis.png',
          },
          sending: false,
          failedToSend: false,
          sent: true,
          received: true,
          read: true,
        },
      ]),
      mostRecentMessage: 'This is Greg',
      messagesUnread: false,
    },
    '2': {
      conversationId: '2',
      otherUsers: List([{
        _id: 1,
        name: 'Zach Kirsch',
        avatar: 'https://scontent.fzty2-1.fna.fbcdn.net/v/t31.0-8/17039378_10212402239837389_66' +
                '23819361607561120_o.jpg?oh=da5905077fe2f7ab636d9e7ac930133c&oe=5B113366',
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
      mostRecentMessage: 'This is Zach',
      messagesUnread: true,
    },
    '3': {
      conversationId: '3',
      otherUsers: List([{
        _id: 2,
        name: 'Jeff Bezos',
        avatar: 'http://mblogthumb3.phinf.naver.net/20160823_162/banddi95_14719406421210hOJW_JPEG/%B0%A1%C0' +
                '%E5_%C6%ED%C7%CF%B0%D4_%BD%C7%C6%D0%C7%D2_%BC%F6_%C0%D6%B4%C2_%C8%B8%BB%E7.jpg?type=w800',
      }]),
      messages: List([
        {
          _id: 0,
          text: 'This is Jeff',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Jeff Bezos',
            avatar: 'http://mblogthumb3.phinf.naver.net/20160823_162/banddi95_14719406421210hOJW_JPEG/%B0%A1%C0' +
                    '%E5_%C6%ED%C7%CF%B0%D4_%BD%C7%C6%D0%C7%D2_%BC%F6_%C0%D6%B4%C2_%C8%B8%BB%E7.jpg?type=w800',
          },
          sending: false,
          failedToSend: false,
          sent: true,
          received: true,
          read: false,
        },
      ]),
      mostRecentMessage: 'This is Jeff',
      messagesUnread: true,
    },
    '4': {
      conversationId: '4',
      otherUsers: List([{
        _id: 3,
        name: 'Mewtwo',
        avatar: 'https://cdn.bulbagarden.net/upload/thumb/7/78/150Mewtwo.png/250px-150Mewtwo.png',
      }]),
      messages: List([]),
      mostRecentMessage: '',
      messagesUnread: false,
    },
    '5': {
      conversationId: '5',
      otherUsers: List([{
        _id: 4,
        name: 'Bane',
        avatar: 'http://www.fitzness.com/blog/wp-content/uploads/Tom-Hardy-Bane-Head-Shot.jpeg',
      }]),
      messages: List([]),
      mostRecentMessage: '',
      messagesUnread: false,
    },
  }),
}

export function matchesReducer(state = initialState, action: MatchesAction): MatchesState {
  let originalConversation: Conversation

  switch (action.type) {

    case MatchesActionType.RECEIVE_MESSAGES:
    case MatchesActionType.ATTEMPT_SEND_MESSAGES:
      console.log('THIS FIRED:', action)
      originalConversation = state.chats.get(action.conversationId)

      let newMessages = originalConversation.messages.asImmutable()
      action.messages.forEach((message) => {
        newMessages = newMessages.unshift(message)
      })

      const newConversation: Conversation = {
        conversationId: originalConversation.conversationId,
        otherUsers: originalConversation.otherUsers.asImmutable(),
        messages: newMessages,
        mostRecentMessage: newMessages.first().text,
        messagesUnread: false,
      }

      return {
        chats: state.chats.set(action.conversationId, newConversation),
      }

    // this is a separate case because redux-persist stores immutables as plain JS
    case MatchesActionType.REHYDRATE:

      // for unit tests when root state is empty
      if (!action.payload.matches) {
        return state
      }

      let chats = Map<string, Conversation>()
      Object.keys(action.payload.matches.chats).forEach((conversationId) => {
        originalConversation = (action.payload.matches.chats as any)[conversationId] /* tslint:disable-line:no-any */
        const conversation: Conversation = {
          conversationId,
          otherUsers: List(originalConversation.otherUsers),
          messages: List(originalConversation.messages),
          mostRecentMessage: originalConversation.mostRecentMessage,
          messagesUnread: originalConversation.messagesUnread,
        }
        chats = chats.set(conversationId, conversation)
      })
      return {
        chats,
      }

    case MatchesActionType.SEND_MESSAGES_SUCCESS: // TODO: mark messages as sent
    case MatchesActionType.SEND_MESSAGES_FAILURE: // TODO: mark messages as errored
    default:
      return state
  }
}
