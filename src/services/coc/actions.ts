/* Actions */

export enum CoCActionType {
  ATTEMPT_ACCEPT_COC = 'ATTEMPT_ACCEPT_COC',
  ACCEPT_COC_SUCCESS = 'ACCEPT_COC_SUCCESS',
  ACCEPT_COC_FAILURE = 'ACCEPT_COC_FAILURE',
  SET_COC_READ_STATUS = 'SET_COC_READ_STATUS',
  OTHER_ACTION = '__any_other_action_type__',
}

export interface AttemptAcceptCoCAction {
  type: CoCActionType.ATTEMPT_ACCEPT_COC
}

export interface AcceptCoCSuccessAction {
  type: CoCActionType.ACCEPT_COC_SUCCESS
}

export interface AcceptCoCFailureAction {
  type: CoCActionType.ACCEPT_COC_FAILURE
  errorMessage: string
}

export interface SetCoCReadStatusAction {
  type: CoCActionType.SET_COC_READ_STATUS,
  readStatus: boolean
}

/* the point of the OtherAction action is for TypeScript to warn us if we don't
 * have a default case when processing actions. We will never dispatch
 * OtherAction, but we do need a default case for the other Actions that are
 * dispatched (by third-party plugins and Redux itself). For more information,
 * see https://spin.atomicobject.com/2017/07/24/redux-action-pattern-typescript/
 */

export interface OtherAction {
  type: CoCActionType.OTHER_ACTION
}

export type CoCAction =
  AttemptAcceptCoCAction
| AcceptCoCSuccessAction
| AcceptCoCFailureAction
| SetCoCReadStatusAction
| OtherAction

/* Action Creators */

export const acceptCoC = (): AttemptAcceptCoCAction => {
  return {
    type: CoCActionType.ATTEMPT_ACCEPT_COC,
  }
}

export const setCoCReadStatus = (readStatus: boolean): SetCoCReadStatusAction => {
  return {
    type: CoCActionType.SET_COC_READ_STATUS,
    readStatus,
  }
}
