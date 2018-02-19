import { Credentials } from './types'

/* Actions */

export enum AuthActionType {
  ATTEMPT_REQUEST_VERIFICATION = 'ATTEMPT_REQUEST_VERIFICATION',
  REQUEST_VERIFICATION_SUCCESS = 'REQUEST_VERIFICATION_SUCCESS',
  REQUEST_VERIFICATION_FAILURE = 'REQUEST_VERIFICATION_FAILURE',
  ATTEMPT_VERIFY_EMAIL = 'ATTEMPT_VERIFY_EMAIL',
  VERIFY_EMAIL_SUCCESS = 'VERIFY_EMAIL_SUCCESS',
  VERIFY_EMAIL_FAILURE = 'VERIFY_EMAIL_FAILURE',
  STORE_SESSION_KEY = 'STORE_SESSION_KEY',
  CLEAR_AUTH_ERROR_MESSAGE = 'CLEAR_AUTH_ERROR_MESSAGE',
  LOGOUT = 'LOGOUT',
  OTHER_ACTION = '__any_other_action_type__',
}

export interface AttemptRequestVerificationAction {
  type: AuthActionType.ATTEMPT_REQUEST_VERIFICATION
  credentials: Credentials
}

export interface RequestVerificationSuccessAction {
  type: AuthActionType.REQUEST_VERIFICATION_SUCCESS
  isNewUser: boolean
}

export interface RequestVerificationFailureAction {
  type: AuthActionType.REQUEST_VERIFICATION_FAILURE
  errorMessage: string
}

export interface AttemptVerifyEmailAction {
  type: AuthActionType.ATTEMPT_VERIFY_EMAIL
  verificationCode: string
}

export interface VerifyEmailSuccessAction {
  type: AuthActionType.VERIFY_EMAIL_SUCCESS
}

export interface VerifyEmailFailureAction {
  type: AuthActionType.VERIFY_EMAIL_FAILURE
  errorMessage: string
}

export interface StoreSessionKeyAction {
  type: AuthActionType.STORE_SESSION_KEY
  sessionKey: string
}

export interface ClearAuthErrorMessageAction {
  type: AuthActionType.CLEAR_AUTH_ERROR_MESSAGE
}

export interface LogoutAction {
  type: AuthActionType.LOGOUT
}

/* the point of the OtherAction action is for TypeScript to warn us if we don't
 * have a default case when processing actions. We will never dispatch
 * OtherAction, but we do need a default case for the other Actions that are
 * dispatched (by third-party plugins and Redux itself). For more information,
 * see https://spin.atomicobject.com/2017/07/24/redux-action-pattern-typescript/
 */

export interface OtherAction {
  type: AuthActionType.OTHER_ACTION
}

export type AuthAction =
  AttemptRequestVerificationAction
| RequestVerificationSuccessAction
| RequestVerificationFailureAction
| AttemptVerifyEmailAction
| VerifyEmailSuccessAction
| VerifyEmailFailureAction
| StoreSessionKeyAction
| ClearAuthErrorMessageAction
| LogoutAction
| OtherAction

/* Action Creators */

export const requestVerification = (credentials: Credentials): AttemptRequestVerificationAction => {
  return {
    type: AuthActionType.ATTEMPT_REQUEST_VERIFICATION,
    credentials,
  }
}

export const verifyEmail = (code: string): AttemptVerifyEmailAction => {
  return {
    type: AuthActionType.ATTEMPT_VERIFY_EMAIL,
    verificationCode: code,
  }
}

export const clearAuthErrorMessage = (): ClearAuthErrorMessageAction => {
  return {
    type: AuthActionType.CLEAR_AUTH_ERROR_MESSAGE,
  }
}

export const logout = (): LogoutAction => {
  return {
    type: AuthActionType.LOGOUT,
  }
}
