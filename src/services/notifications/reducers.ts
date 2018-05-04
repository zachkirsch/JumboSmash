import { List } from 'immutable'
import { NotificationsActionType, NotificationsAction } from './actions'
import { NotificationsState } from './types'
import { ReduxActionType } from '../redux'

const initialState: NotificationsState = {
  inAppNotifications: List(),
}

export function notificationsReducer(state = initialState, action: NotificationsAction): NotificationsState {

  switch (action.type) {

    case NotificationsActionType.ADD_IN_APP_NOTIFICATION:
      const id = state.inAppNotifications.size === 0
        ? 0
        : state.inAppNotifications.last().id + 1

      return {
        inAppNotifications: state.inAppNotifications.push({
          id,
          ...action.notification,
        }),
      }

    case NotificationsActionType.DELETE_IN_APP_NOTIFICATION:
      return {
        inAppNotifications: state.inAppNotifications.filter(n => !!n && n.id !== action.id).toList(),
      }

    case NotificationsActionType.CLEAR_NOTIFICATIONS_STATE:
    case ReduxActionType.REHYDRATE:
      return {
        ...initialState,
      }

    default:
      return state
  }
}
