import { List } from 'immutable'
import { SwipeAction, SwipeActionType } from './actions'
import { SwipeState } from './types'
import { ReduxActionType } from '../redux'
import { shuffle } from '../../utils'
import { User } from './types'

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

      let nextIndexOfUserOnTop = (state.indexOfUserOnTop + 1) % newUsers.size

      // if we're about to leave the stale zone, remove stale users
      if (newUsers.get(state.indexOfUserOnTop).stale && !newUsers.get(nextIndexOfUserOnTop).stale) {
        newUsers = newUsers.slice(nextIndexOfUserOnTop).toList()
        nextIndexOfUserOnTop = 0
      }

      return {
        ...state,
        allUsers: {
          ...state.allUsers,
          value: newUsers,
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

      // keep the next ten users around (at the start of the list)
      // to avoid rendering issues, but mark them as stale so that
      // we can remove them once we're onto the new users
      let oldUsers: List<User> = List()
      const numExistingUsers = state.allUsers.value.size
      for (let i = 0; i < Math.min(5, numExistingUsers); i++) {
        oldUsers = oldUsers.push({
          ...state.allUsers.value.get((state.indexOfUserOnTop + i) % numExistingUsers),
          stale: true,
        })
      }

      // remove duplicates
      const usersToAdd = action.users.filter(user => {
        if (user === undefined) {
          return false
        }
        return !oldUsers.find(u => !!u && u.id === user.id)
      })

      return {
        indexOfUserOnTop: 0,
        allUsers: {
          value: oldUsers.concat(shuffle(usersToAdd)).toList(),
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
