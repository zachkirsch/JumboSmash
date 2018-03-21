import { RootState } from '../../redux'

/* Actions */

export enum ReduxActionType {
  REHYDRATE = 'persist/REHYDRATE',
  SET_REHYDRATED = 'SET_REHYDRATED',
  OTHER_ACTION = '__any_other_action_type__',
}

export interface RehydrateAction {
  type: ReduxActionType.REHYDRATE
  payload: RootState
}

export interface SetRehydratedAction {
  type: ReduxActionType.SET_REHYDRATED
}

/* the point of the OtherAction action is for TypeScript to warn us if we don't
 * have a default case when processing actions. We will never dispatch
 * OtherAction, but we do need a default case for the other Actions that are
 * dispatched (by third-party plugins and Redux itself). For more information,
 * see https://spin.atomicobject.com/2017/07/24/redux-action-pattern-typescript/
 */

export interface OtherAction {
  type: ReduxActionType.OTHER_ACTION
}

export type ReduxAction =
  RehydrateAction
| SetRehydratedAction
| OtherAction

/* Action Creators */

export const setRehydrated = (): SetRehydratedAction => {
  return {
    type: ReduxActionType.SET_REHYDRATED,
  }
}
