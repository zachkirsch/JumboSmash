/* Actions */

export enum CoCActionType {
  ACCEPT_COC = 'ACCEPT_COC',
  REJECT_COC = 'REJECT_COC',
  OTHER_ACTION = '__any_other_action_type__',
}

export interface AcceptCoCAction {
  type: CoCActionType.ACCEPT_COC
}

/* the point of the OtherAction action is for TypeScript to warn us if we don't
* have a default case when procceseing actions. We will never dispath
* OtherAction, but we do need a default case for the other Actions that are
* dispatch (by third-party plugins and Redux itself). For more information, see
* https://spin.atomicobject.com/2017/07/24/redux-action-pattern-typescript/
*/

export interface OtherAction {
  type: CoCActionType.OTHER_ACTION
}

export type CoCAction =
  AcceptCoCAction
| OtherAction

/* Action Creators */

export const acceptCoC = (): AcceptCoCAction => {
  return {
    type: CoCActionType.ACCEPT_COC,
  }
}
