import { RehydrateAction } from '../redux'
import { InAppNotificationWithoutId } from './types'
/* Actions */

export enum NotificationsActionType {
  SET_NOTIFICATIONS_TOKEN = 'SET_NOTIFICATIONS_TOKEN',

  ADD_IN_APP_NOTIFICATION = 'ADD_IN_APP_NOTIFICATION',
  DELETE_IN_APP_NOTIFICATION = 'DELETE_IN_APP_NOTIFICATION',

  CLEAR_NOTIFICATIONS_STATE = 'CLEAR_NOTIFICATIONS_STATE',

  OTHER_ACTION = '__any_other_action_type__',
}

export interface SetNotificationsTokenAction {
  type: NotificationsActionType.SET_NOTIFICATIONS_TOKEN,
  token?: string
}

export interface AddInAppNotificationAction {
  type: NotificationsActionType.ADD_IN_APP_NOTIFICATION
  notification: InAppNotificationWithoutId
}

export interface DeleteInAppNotificationAction  {
  type: NotificationsActionType.DELETE_IN_APP_NOTIFICATION
  id: number
}

export interface ClearNotificationsStateAction {
  type: NotificationsActionType.CLEAR_NOTIFICATIONS_STATE
}

/* the point of the OtherAction action is for TypeScript to warn us if we don't
* have a default case when processing actions. We will never dispatch
* OtherAction, but we do need a default case for the other Actions that are
* dispatched (by third-party plugins and Redux itself). For more information,
* see https://spin.atomicobject.com/2017/07/24/redux-action-pattern-typescript/
*/

export interface OtherAction {
  type: NotificationsActionType.OTHER_ACTION
}

export type NotificationsAction =
SetNotificationsTokenAction
| AddInAppNotificationAction
| DeleteInAppNotificationAction
| ClearNotificationsStateAction
| RehydrateAction
| OtherAction

/* Action Creators */

export const setNotificationsToken = (token?: string): SetNotificationsTokenAction => {
  return {
    type: NotificationsActionType.SET_NOTIFICATIONS_TOKEN,
    token,
  }
}

export const addInAppNotification = (notification: InAppNotificationWithoutId): AddInAppNotificationAction => {
  return {
    type: NotificationsActionType.ADD_IN_APP_NOTIFICATION,
    notification,
  }
}

export const deleteInAppNotification = (id: number): DeleteInAppNotificationAction => {
  return {
    type: NotificationsActionType.DELETE_IN_APP_NOTIFICATION,
    id,
  }
}

export const clearNotificationsState = (): ClearNotificationsStateAction => {
  return {
    type: NotificationsActionType.CLEAR_NOTIFICATIONS_STATE,
  }
}
