import { LoginSuccessAction, LoginFailureAction, LogoutAction } from './auth'

export enum TypeKey {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  OTHER_ACTION = '__any_other_action_type__'
}

/* the point of the OtherAction action is for TypeScript to warn us if we don't
* have a default case when procceseing actions. We will never dispath
* OtherAction, but we do need a default case for the other Actions that are
* dispatch (by third-party plugins and Redux itself). For more information, see
* https://spin.atomicobject.com/2017/07/24/redux-action-pattern-typescript/
*/

export interface OtherAction {
  type: TypeKey.OTHER_ACTION
}

export type ActionType =
| LoginSuccessAction
| LoginFailureAction
| LogoutAction
| OtherAction
