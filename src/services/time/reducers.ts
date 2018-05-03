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
}

const now = Date.now()

let error = true

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

    case TimeActionType.GET_SERVER_TIME_SUCCESS:
      error = !error
      return {
        serverTime: {
          value: action.serverTime,
          lastFetched: Date.now(),
          loading: false,
        },
        releaseDate: action.releaseDate,
        postRelease:  action.postRelease,
        postRelease2: action.postRelease2,
      }

    case TimeActionType.GET_SERVER_TIME_FAILURE:
      return {
        ...initialState,
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
      }

    default:
      return state
  }
}
