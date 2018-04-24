import { NavigationAction, NavigationActionType } from './actions'
import { NavigationState } from './types'
import { MatchesActionType } from '../matches'

const initialState: NavigationState = {}

export function navigationReducer(state = initialState, action: NavigationAction): NavigationState {
  switch (action.type) {

    case NavigationActionType.SET_TAB_BAR_OVERLAY:
      return {
        ...state,
        tabBarOverlay: action.component,
      }

    case NavigationActionType.CLEAR_TAB_BAR_OVERLAY:
      return {
        ...state,
        tabBarOverlay: undefined,
      }

    case NavigationActionType.SWITCH_TAB:
      return {
        ...state,
        selectedTab: action.tab,
        shouldShowChatIndicator: action.tab !== 'Matches' && state.shouldShowChatIndicator,
      }

    case MatchesActionType.RECEIVE_MESSAGES:
      if (state.selectedTab === 'Matches') {
        return state
      }
      return {
        ...state,
        shouldShowChatIndicator: true,
      }

    case NavigationActionType.CLEAR_NAVIGATION_STATE:
      return initialState

    default:
      return state
  }
}
