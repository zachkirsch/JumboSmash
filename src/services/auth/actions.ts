import { Credentials } from './types'

/* Actions */

export enum AuthActionType {
  ATTEMPT_LOGIN = 'ATTEMPT_LOGIN',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  OTHER_ACTION = '__any_other_action_type__'
}

export interface AttemptLoginAction {
  type: AuthActionType.ATTEMPT_LOGIN
  credentials: Credentials
}

export interface LoginSuccessAction {
  type: AuthActionType.LOGIN_SUCCESS
  sessionKey: string
}

export interface LoginFailureAction {
  type: AuthActionType.LOGIN_FAILURE
  errorMessage: string
}

export interface LogoutAction {
  type: AuthActionType.LOGOUT
}

/* the point of the OtherAction action is for TypeScript to warn us if we don't
* have a default case when procceseing actions. We will never dispath
* OtherAction, but we do need a default case for the other Actions that are
* dispatch (by third-party plugins and Redux itself). For more information, see
* https://spin.atomicobject.com/2017/07/24/redux-action-pattern-typescript/
*/

export interface OtherAction {
  type: AuthActionType.OTHER_ACTION
}

export type AuthAction =
  AttemptLoginAction
| LoginSuccessAction
| LoginFailureAction
| LogoutAction
| OtherAction

/* Action Creators */

export const login = (credentials: Credentials): AttemptLoginAction => {
  return {
    type: AuthActionType.ATTEMPT_LOGIN,
    credentials
  }
}

export const logout = (): LogoutAction => {
  return {
    type: AuthActionType.LOGOUT
  }
}
