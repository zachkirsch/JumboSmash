import { ReduxActionType, ReduxAction } from './actions'
import { ReduxState } from './types'

const initialState: ReduxState = {
  rehydrated: false,
}

export function reduxReducer(state = initialState, action: ReduxAction): ReduxState {
  switch (action.type) {

    case ReduxActionType.SET_REHYDRATED:
      return {
        rehydrated: true,
      }

    default:
      return state
  }
}
