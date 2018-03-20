import { List } from 'immutable'
import { SwipeActionType, SwipeAction } from './actions'
import { SwipeState } from './types'

const initialState: SwipeState = {
  allUsers: {
    value: List(),
    loading: false,
  },
}

export function swipeReducer(state = initialState, action: SwipeAction): SwipeState {
  switch (action.type) {

    case SwipeActionType.ATTEMPT_FETCH_ALL_USERS:
      return {
        ...state,
        allUsers: {
          value: state.allUsers.value,
          loading: true,
        },
      }

    case SwipeActionType.FETCH_ALL_USERS_SUCCESS:
      return {
        ...state,
        allUsers: {
          value: List(action.users),
          loading: false,
        },
      }

    case SwipeActionType.FETCH_ALL_USERS_FAILURE:
      return {
        ...state,
        allUsers: {
          value: state.allUsers.value,
          loading: false,
          errorMessage: action.errorMessage,
        },
      }

    case SwipeActionType.CLEAR_SWIPE_STATE:
      return initialState

    default:
      return state
  }
}
