import { List } from 'immutable'
import { SwipeAction, SwipeActionType } from './actions'
import { SwipeState } from './types'
import { ReduxActionType } from '../redux'

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

    case ReduxActionType.REHYDRATE:

      // for unit tests when root state is empty
      if (!action.payload.profile) {
        return state
      }

      return {
        allUsers: {
          ...action.payload.swipe.allUsers,
          loading: false,
          errorMessage: action.payload.swipe.allUsers.loading ? 'Failed to fetch users' : '',
        },
      }

    default:
      return state
  }
}
