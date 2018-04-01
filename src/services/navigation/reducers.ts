import { NavigationAction, NavigationActionType } from './actions'
import { NavigationState } from './types'

const initialState: NavigationState = {

}

export function navigationReducer(state = initialState, action: NavigationAction): NavigationState {

  switch (action.type) {

    case NavigationActionType.SET_TAB_BAR_OVERLAY:
      return {
        tabBarOverlay: action.component,
      }

    case NavigationActionType.CLEAR_TAB_BAR_OVERLAY:
      return initialState

    default:
      return state
  }
}
