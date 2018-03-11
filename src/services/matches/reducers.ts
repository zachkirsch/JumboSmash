import { MatchesActionType, MatchesAction } from './actions'
import { MatchesState } from './types'

const initialState: MatchesState = {
  matches: {},
}

export function matchesReducer(state = initialState, action: MatchesAction): MatchesState {

  const newState = Object.assign({}, state)
  let numMessages

  switch (action.type) {

    case MatchesActionType.ATTEMPT_SEND_MESSAGES:
      const newMessages = action.messages.map((message) => {
        message.sending = true
        return message
      })
      newState.matches[action.conversationId].messages.concat(newMessages)
      return newState

    case MatchesActionType.SEND_MESSAGES_SUCCESS:
    case MatchesActionType.SEND_MESSAGES_FAILURE:
      numMessages = newState.matches[action.conversationId].messages.length
      for (let i = numMessages - 1; i >= 0; i++) {
        const message = action.messages.find((newMessage) => {
          return newMessage._id === newState.matches[action.conversationId].messages[i]._id
        })
        if (message) {
            newState.matches[action.conversationId].messages[i].sending = false
          if (action.type === MatchesActionType.SEND_MESSAGES_SUCCESS) {
            newState.matches[action.conversationId].messages[i].sent = true
          } else if (action.type === MatchesActionType.SEND_MESSAGES_FAILURE) {
            newState.matches[action.conversationId].messages[i].sent = false
            newState.matches[action.conversationId].messages[i].failedToSend = true
          }
        }
      }
      return newState

    default:
      return newState
  }
}
