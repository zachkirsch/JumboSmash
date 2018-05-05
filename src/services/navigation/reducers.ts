import { NavigationAction, NavigationActionType } from './actions'
import { NavigationState } from './types'
import { NotificationsActionType } from '../notifications/actions'
import { ReduxActionType } from '../redux'

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

    case NotificationsActionType.ADD_IN_APP_NOTIFICATION:
      if (state.selectedTab === 'Matches') {
        return state
      }
      if (action.notification.type !== 'chat') {
        return state
      }
      return {
        ...state,
        shouldShowChatIndicator: false, // TODO: make this true when necessary
      }

    case NavigationActionType.CLEAR_NAVIGATION_STATE:
    case ReduxActionType.REHYDRATE:
      return {
        ...initialState,
      }

    default:
      return state
  }
}
