import { Credentials } from './types'

/* Actions */

export enum AuthActionType {
  ATTEMPT_LOGIN = 'ATTEMPT_LOGIN',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  ATTEMPT_ACCEPT_COC = 'ATTEMPT_ACCEPT_COC',
  ACCEPT_COC_SUCCESS = 'ACCEPT_COC_SUCCESS',
  ACCEPT_COC_FAILURE = 'ACCEPT_COC_FAILURE',
  SET_COC_READ_STATUS = 'SET_COC_READ_STATUS',
  ATTEMPT_REQUEST_VERIFICATION = 'ATTEMPT_REQUEST_VERIFICATION',
  REQUEST_VERIFICATION_SUCCESS = 'REQUEST_VERIFICATION_SUCCESS',
  REQUEST_VERIFICATION_FAILURE = 'REQUEST_VERIFICATION_FAILURE',
  CONFIRM_NEAR_TUFTS = 'CONFIRM_NEAR_TUFTS',
  ATTEMPT_VERIFY_EMAIL = 'ATTEMPT_VERIFY_EMAIL',
  VERIFY_EMAIL_SUCCESS = 'VERIFY_EMAIL_SUCCESS',
  VERIFY_EMAIL_FAILURE = 'VERIFY_EMAIL_FAILURE',
  SET_SESSION_KEY = 'SET_SESSION_KEY',
  SET_ID = 'SET_ID',
  FINISH_TUTORIAL = 'FINISH_TUTORIAL',
  CLEAR_AUTH_ERROR_MESSAGES = 'CLEAR_AUTH_ERROR_MESSAGES',
  LOGOUT = 'LOGOUT',
  DEACTIVATE = 'DEACTIVATE',
  OTHER_ACTION = '__any_other_action_type__',
}

export interface AttemptLoginAction {
  type: AuthActionType.ATTEMPT_LOGIN
}

export interface LoginSuccessAction {
  type: AuthActionType.LOGIN_SUCCESS
}

export interface LoginFailureAction {
  type: AuthActionType.LOGIN_FAILURE
  errorMessage: string
}

export interface AttemptRequestVerificationAction {
  type: AuthActionType.ATTEMPT_REQUEST_VERIFICATION
  credentials: Credentials
}

export interface RequestVerificationSuccessAction {
  type: AuthActionType.REQUEST_VERIFICATION_SUCCESS
  isNewUser: boolean
  deviceId: string
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
  sessionKey: string
  classYear: number
}

export interface VerifyEmailFailureAction {
  type: AuthActionType.VERIFY_EMAIL_FAILURE
  errorMessage: string
}

export interface ConfirmNearTuftsAction {
  type: AuthActionType.CONFIRM_NEAR_TUFTS
}

export interface SetSessionKeyAction {
  type: AuthActionType.SET_SESSION_KEY
  sessionKey: string
}

export interface FinishTutorialAction {
  type: AuthActionType.FINISH_TUTORIAL
}

export interface AttemptAcceptCoCAction {
  type: AuthActionType.ATTEMPT_ACCEPT_COC
}

export interface AcceptCoCSuccessAction {
  type: AuthActionType.ACCEPT_COC_SUCCESS
}

export interface AcceptCoCFailureAction {
  type: AuthActionType.ACCEPT_COC_FAILURE
  errorMessage: string
}

export interface SetCoCReadStatusAction {
  type: AuthActionType.SET_COC_READ_STATUS,
  readStatus: boolean
}

export interface ClearAuthErrorMessagesAction {
  type: AuthActionType.CLEAR_AUTH_ERROR_MESSAGES
}

export interface LogoutAction {
  type: AuthActionType.LOGOUT
}

export interface DeactivateAction {
  type: AuthActionType.DEACTIVATE
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

export type AuthAction = AttemptLoginAction
| LoginSuccessAction
| LoginFailureAction
| AttemptRequestVerificationAction
| RequestVerificationSuccessAction
| RequestVerificationFailureAction
| AttemptVerifyEmailAction
| VerifyEmailSuccessAction
| VerifyEmailFailureAction
| ConfirmNearTuftsAction
| SetSessionKeyAction
| FinishTutorialAction
| AttemptAcceptCoCAction
| AcceptCoCSuccessAction
| AcceptCoCFailureAction
| SetCoCReadStatusAction
| ClearAuthErrorMessagesAction
| LogoutAction
| DeactivateAction
| OtherAction

/* Action Creators */

export const attemptLogin = (): AttemptLoginAction => {
  return {
    type: AuthActionType.ATTEMPT_LOGIN,
  }
}

export const acceptCoC = (): AttemptAcceptCoCAction => {
  return {
    type: AuthActionType.ATTEMPT_ACCEPT_COC,
  }
}

export const setCoCReadStatus = (readStatus: boolean): SetCoCReadStatusAction => {
  return {
    type: AuthActionType.SET_COC_READ_STATUS,
    readStatus,
  }
}

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

export const confirmNearTufts = (): ConfirmNearTuftsAction => {
  return {
    type: AuthActionType.CONFIRM_NEAR_TUFTS,
  }
}

export const setSessionKey = (sessionKey: string): SetSessionKeyAction => {
  return {
    type: AuthActionType.SET_SESSION_KEY,
    sessionKey,
  }
}

export const finishTutorial = (): FinishTutorialAction => {
  return {
    type: AuthActionType.FINISH_TUTORIAL,
  }
}

export const clearAuthErrorMessages = (): ClearAuthErrorMessagesAction => {
  return {
    type: AuthActionType.CLEAR_AUTH_ERROR_MESSAGES,
  }
}

export const logout = (): LogoutAction => {
  return {
    type: AuthActionType.LOGOUT,
  }
}

export const deactivate = (): DeactivateAction => {
  return {
    type: AuthActionType.DEACTIVATE,
  }
}
