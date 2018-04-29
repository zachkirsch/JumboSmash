import { TimeAction, TimeActionType } from './actions'
import { TimeState } from './types'

const initialState: TimeState = {
  serverTime: {
    value: undefined,
    loading: false,
  },
  releaseDate: 1525004190000,
  postRelease: true, // false,
  postRelease2: false,
}

export function timeReducer(state = initialState, action: TimeAction): TimeState {
  return initialState
  switch (action.type) {

    case TimeActionType.ATTEMPT_GET_SERVER_TIME:
      return {
        ...state,
        serverTime: {
          ...state.serverTime,
          loading: true,
        },
      }

    case TimeActionType.GET_SERVER_TIME_SUCCESS:
      return {
        serverTime: {
          value: action.serverTime,
          lastFetched: Date.now(),
          loading: false,
        },
        releaseDate: action.releaseDate,
        postRelease: true,
        postRelease2: action.postRelease2,
      }

    case TimeActionType.GET_SERVER_TIME_FAILURE:
      return {
        ...state,
        serverTime: {
          ...state.serverTime,
          loading: false,
          errorMessage: action.errorMessage,
        },
      }

    default:
      return state
  }
}
