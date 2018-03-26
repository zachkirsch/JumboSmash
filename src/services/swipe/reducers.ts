import { List } from 'immutable'
import { SwipeAction, SwipeActionType } from './actions'
import { SwipeState } from './types'
import { ReduxActionType } from '../redux'
import { shuffle } from '../../components/utils'

const initialState: SwipeState = {
  allUsers: {
    value: List(),
    loading: false,
  },
  indexOfUserOnTop: 0,
}

export function swipeReducer(state = initialState, action: SwipeAction): SwipeState {
  switch (action.type) {

    case SwipeActionType.ATTEMPT_SWIPE:
      return {
        ...state,
        indexOfUserOnTop: (state.indexOfUserOnTop + 1) % state.allUsers.value.count(),
      }

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
        indexOfUserOnTop: 0,
        allUsers: {
          value: state.allUsers.value.slice(state.indexOfUserOnTop).concat(shuffle(action.users)).toList(),
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
        ...initialState,
      }

    default:
      return state
  }
}
