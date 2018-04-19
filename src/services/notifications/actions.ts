/* Actions */

export enum NotificationsActionType {
  SET_NOTIFICATIONS_TOKEN = 'SET_NOTIFICATIONS_TOKEN',
  OTHER_ACTION = '__any_other_action_type__',
}

export interface SetNotificationsTokenAction {
  type: NotificationsActionType.SET_NOTIFICATIONS_TOKEN,
  token?: string
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
| OtherAction

/* Action Creators */

export const setNotificationsToken = (token?: string): SetNotificationsTokenAction => {
  return {
    type: NotificationsActionType.SET_NOTIFICATIONS_TOKEN,
    token,
  }
}
