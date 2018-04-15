import { List } from 'immutable'
import { SwipeAction, SwipeActionType } from './actions'
import { SwipeState } from './types'
import { ReduxActionType } from '../redux'
import { shuffle } from '../../utils'

const initialState: SwipeState = {
  allUsers: {
    value: List(),
    loading: false,
  },
  indexOfUserOnTop: 0,
}

export function swipeReducer(state = initialState, action: SwipeAction): SwipeState {

  let newUsers = state.allUsers.value

  switch (action.type) {

    case SwipeActionType.ATTEMPT_SWIPE:

      let nextIndexOfUserOnTop = state.indexOfUserOnTop + 1

      // if this is a right swipe, remove any duplicates so the user won't see this person again
      let finalUsers = newUsers
      if (action.direction === 'right') {
        finalUsers = List()
        for (let i = 0; i < newUsers.size; i++) {
          const user = newUsers.get(i)
          if (user.id !== action.onUser.id) {
            finalUsers = finalUsers.push(user)
          } else if (i < nextIndexOfUserOnTop) {
            nextIndexOfUserOnTop -= 1
          }
        }
      }

      nextIndexOfUserOnTop = nextIndexOfUserOnTop % finalUsers.size

      return {
        ...state,
        allUsers: {
          ...state.allUsers,
          value: finalUsers,
        },
        indexOfUserOnTop: nextIndexOfUserOnTop,
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
          value: List(shuffle(action.users)),
          loading: false,
        },
        lastFetched: Date.now(),
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
