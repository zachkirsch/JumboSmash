import { AuthActionType, Credentials } from './types'

/* Actions */

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
