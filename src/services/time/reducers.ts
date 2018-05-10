import { TimeAction, TimeActionType } from './actions'
import { TimeState } from './types'
import { ReduxActionType } from '../redux'

const initialState: TimeState = {
  serverTime: {
    value: undefined,
    loading: false,
  },
  releaseDate: 1525996799999,
  postRelease: false,
  postRelease2: false,
  hasSeenCountdown: false,
}

export function timeReducer(state = initialState, action: TimeAction): TimeState {
  switch (action.type) {

    case TimeActionType.ATTEMPT_GET_SERVER_TIME:
      return {
        ...state,
        serverTime: {
          ...state.serverTime,
          loading: true,
        },
      }

    case TimeActionType.MARK_COUNTDOWN_AS_SEEN:
      return {
        ...state,
        hasSeenCountdown: true,
      }

    case TimeActionType.GET_SERVER_TIME_SUCCESS:
      return {
        serverTime: {
          value: action.serverTime,
          lastFetched: Date.now(),
          loading: false,
        },
        releaseDate: action.releaseDate,
        postRelease:  action.postRelease,
        postRelease2: action.postRelease2,
        hasSeenCountdown: state.hasSeenCountdown,
      }

    case TimeActionType.GET_SERVER_TIME_FAILURE:
      return {
        ...initialState,
        hasSeenCountdown: state.hasSeenCountdown,
        serverTime: {
          loading: false,
          value: undefined,
          lastFetched: Date.now(),
          errorMessage: action.errorMessage,
        },
      }

    case ReduxActionType.REHYDRATE:
      return {
        ...initialState,
        hasSeenCountdown: action.payload.time.hasSeenCountdown,
      }

    default:
      return state
  }
}
