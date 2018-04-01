/* Actions */

export enum NavigationActionType {
  SET_TAB_BAR_OVERLAY = 'SET_TAB_BAR_OVERLAY',
  CLEAR_TAB_BAR_OVERLAY = 'CLEAR_TAB_BAR_OVERLAY',
  OTHER_ACTION = '__any_other_action_type__',
}

export interface SetTabBarOverlayAction {
  type: NavigationActionType.SET_TAB_BAR_OVERLAY
  component: () => JSX.Element
}

export interface ClearTabBarOverlayAction {
  type: NavigationActionType.CLEAR_TAB_BAR_OVERLAY
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
| OtherAction

/* Action Creators */

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
