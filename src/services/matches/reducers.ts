import { MatchesActionType, MatchesAction } from './actions'
import { MatchesState } from './types'

const initialState: MatchesState = {
  matches: {},
}

export function matchesReducer(state = initialState, action: MatchesAction): MatchesState {
  const newState = Object.assign({}, state)
  switch (action.type) {

    case MatchesActionType.ATTEMPT_SEND_MESSAGES:
      const newMessages = action.messages.map((message) => {
        message.sending = true
        return message
      })
      newState.matches[action.toUser].messages.concat(newMessages)
      return newState

    case MatchesActionType.SEND_MESSAGES_SUCCESS:
      const numMessages = newState.matches[action.toUser].messages.length
      for (let i = numMessages - 1; i >= 0; i++) {
        const message = action.messages.find((newMessage) => {
          return newMessage._id === newState.matches[action.toUser].messages[i]._id
        })
        if (message) {
          newState.matches[action.toUser].messages[i].sending = false
          newState.matches[action.toUser].messages[i].sent = true
        }
      }
      return newState

    /* TODO: other actions, sagas */

    default:
      return newState
  }
}
