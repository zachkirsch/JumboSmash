import { MatchesActionType, MatchesAction } from './actions'
import { MatchesState } from './types'

const initialState: MatchesState = {
  matches: {
    '1234': {
      otherUsers: [
        {
          _id: 2,
          name: 'Greg Aloupis',
          avatar: 'https://scontent.fzty2-1.fna.fbcdn.net' +
          '/v/t31.0-8/17039378_10212402239837389_6623819361607561120_o.jpg?oh=da5905077fe2f7ab636d9e7ac930133c&oe=5B113366',
        }
      ],
      messages: [],
      mostRecentMessage: '',
    }
  },
}

export function matchesReducer(state = initialState, action: MatchesAction): MatchesState {
  const newState = Object.assign({}, state)
  let oldMessages

  switch (action.type) {

    case MatchesActionType.ATTEMPT_SEND_MESSAGES:
      const messages = newState.matches[action.conversationId].messages

      const newMessages = action.messages.map((message) => {
        return {
          ...message,
          sending: true,
        }
      })
      newMessages = newMessages.concat(messages)

      const mostRecentMessage = newMessages.length ? newMessages[newMessages.length - 1].text : 'NO MESSAGES'
      newState.matches[action.conversationId] = {
        otherUsers: newState.matches[action.conversationId].otherUsers,
        messages: newMessages,
        mostRecentMessage,
      }
      return newState

    case MatchesActionType.SEND_MESSAGES_SUCCESS:
    case MatchesActionType.SEND_MESSAGES_FAILURE:
      oldMessages = newState.matches[action.conversationId].messages.slice()
      const numMessages = oldMessages.length
      for (let i = numMessages - 1; i >= 0; i--) {
        const message = action.messages.find((newMessage) => {
          return newMessage._id === oldMessages[i]._id
        })
        if (message) {
          oldMessages[i].sending = false
          if (action.type === MatchesActionType.SEND_MESSAGES_SUCCESS) {
            oldMessages[i].sent = true
          } else if (action.type === MatchesActionType.SEND_MESSAGES_FAILURE) {
            oldMessages[i].sent = false
            oldMessages[i].failedToSend = true
          }
        }
      }
      newState.matches[action.conversationId].messages = oldMessages
      return newState

    default:
      console.log('here')
      console.log(state)
      console.log(newState)
      return newState
  }
}
