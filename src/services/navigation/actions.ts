import { RouteName } from './types'
import { ReceiveMessagesAction } from '../matches'

/* Actions */

export enum NavigationActionType {
  SET_TAB_BAR_OVERLAY = 'SET_TAB_BAR_OVERLAY',
  CLEAR_TAB_BAR_OVERLAY = 'CLEAR_TAB_BAR_OVERLAY',
  SWITCH_TAB = 'SWITCH_TAB',
  CLEAR_NAVIGATION_STATE = 'CLEAR_NAVIGATION_STATE',
  OTHER_ACTION = '__any_other_action_type__',
}

export interface SetTabBarOverlayAction {
  type: NavigationActionType.SET_TAB_BAR_OVERLAY
  component: () => JSX.Element
}

export interface ClearTabBarOverlayAction {
  type: NavigationActionType.CLEAR_TAB_BAR_OVERLAY
}

export interface SwitchTabAction {
  type: NavigationActionType.SWITCH_TAB
  tab: RouteName
}

export interface ClearNavigationStateAction {
  type: NavigationActionType.CLEAR_NAVIGATION_STATE
}

/* the point of the OtherAction action is for TypeScript to warn us if we don't
 * have a default case when processing actions. We will never dispatch
 * OtherAction, but we do need a default case for the other Actions that are
 * dispatched (by third-party plugins and Redux itself). For more information,
 * see https://spin.atomicobject.com/2017/07/24/redux-action-pattern-typescript/
 */

export interface OtherAction {
  type: NavigationActionType.OTHER_ACTION
}

export type NavigationAction =
  SetTabBarOverlayAction
| ClearTabBarOverlayAction
| SwitchTabAction
| ReceiveMessagesAction
| ClearNavigationStateAction
| OtherAction

/* Action Creators */

export const clearNavigationState = (): ClearNavigationStateAction => {
  return {
    type: NavigationActionType.CLEAR_NAVIGATION_STATE,
  }
}

export const setTabBarOverlay = (component: () => JSX.Element): SetTabBarOverlayAction => {
  return {
    type: NavigationActionType.SET_TAB_BAR_OVERLAY,
    component,
  }
}

export const clearTabBarOverlay = (): ClearTabBarOverlayAction => {
  return {
    type: NavigationActionType.CLEAR_TAB_BAR_OVERLAY,
  }
}

export const switchTab = (tab: RouteName): SwitchTabAction => {
  return {
    type: NavigationActionType.SWITCH_TAB,
    tab,
  }
}
