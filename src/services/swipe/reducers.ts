import { List, Map } from 'immutable'
import { SwipeAction, SwipeActionType } from './actions'
import { SwipeState, User } from './types'
import { ReduxActionType } from '../redux'
import { shuffle } from '../../utils'

const initialState: SwipeState = {
  swipableUsers: {
    value: List(),
    loading: false,
  },
  allUsers: {
    value: Map<number, User>(),
    loading: false,
  },
  indexOfUserOnTop: 0,
}

export function swipeReducer(state = initialState, action: SwipeAction): SwipeState {

  let newSwipableUsers = state.swipableUsers.value

  switch (action.type) {

    case SwipeActionType.ATTEMPT_SWIPE:

      let nextIndexOfUserOnTop = state.indexOfUserOnTop + 1

      // if this is a right swipe, remove any duplicates so the user won't see this person again
      let finalUsers = newSwipableUsers
      if (action.direction === 'right') {
        finalUsers = List()
        for (let i = 0; i < newSwipableUsers.size; i++) {
          const user = newSwipableUsers.get(i)
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
        swipableUsers: {
          ...state.swipableUsers,
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
      let allUsersMap = Map<number, User>()
      action.users.forEach(user => {
        allUsersMap = allUsersMap.set(user.id, user)
      })
      return {
        ...state,
        indexOfUserOnTop: 0,
        allUsers: {
          value: allUsersMap,
          loading: false,
        },
        lastFetchedAllUsers: Date.now(),
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

    case SwipeActionType.ATTEMPT_FETCH_SWIPABLE_USERS:
      return {
        ...state,
        swipableUsers: {
          value: state.swipableUsers.value,
          loading: true,
        },
      }

    case SwipeActionType.FETCH_SWIPABLE_USERS_SUCCESS:
      return {
        ...state,
        indexOfUserOnTop: 0,
        swipableUsers: {
          value: List(shuffle(action.users)),
          loading: false,
        },
        lastFetchedSwipableUsers: Date.now(),
      }

    case SwipeActionType.FETCH_SWIPABLE_USERS_FAILURE:
      return {
        ...state,
        swipableUsers: {
          value: state.swipableUsers.value,
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

      allUsersMap = Map<number, User>()
      Object.keys(action.payload.swipe.allUsers.value).forEach(userId => {
        /* tslint:disable-next-line:no-any */
        const user: User = (action.payload.swipe.allUsers.value as any)[userId]
        allUsersMap = allUsersMap.set(parseInt(userId, 10), user)
      })

      return {
        ...initialState,
        allUsers: {
          value: allUsersMap,
          loading: false,
        },
      }

    default:
      return state
  }
}
