/* Actions */

export enum FirebaseActionType {
  ATTEMPT_CONNECT_TO_FIREBASE = 'ATTEMPT_CONNECT_TO_FIREBASE',
  CONNECT_TO_FIREBASE_SUCCESS = 'CONNECT_TO_FIREBASE_SUCCESS',
  CONNECT_TO_FIREBASE_FAILURE = 'CONNECT_TO_FIREBASE_FAILURE',
  SET_FIREBASE_TOKEN = 'SET_FIREBASE_TOKEN',
  LOGOUT_FIREBASE = 'LOGOUT_FIREBASE',
  OTHER_ACTION = '__any_other_action_type__',
}

export interface AttemptConnectToFirebaseAction {
  type: FirebaseActionType.ATTEMPT_CONNECT_TO_FIREBASE
  token: string
}

export interface ConnectToFirebaseSuccessAction {
  type: FirebaseActionType.CONNECT_TO_FIREBASE_SUCCESS
}

export interface ConnectToFirebaseFailureAction {
  type: FirebaseActionType.CONNECT_TO_FIREBASE_FAILURE
  errorMessage: string
}

export interface SetFirebaseTokenAction {
  type: FirebaseActionType.SET_FIREBASE_TOKEN
  token: string
}

export interface LogoutFirebaseAction {
  type: FirebaseActionType.LOGOUT_FIREBASE
}

/* the point of the OtherAction action is for TypeScript to warn us if we don't
* have a default case when processing actions. We will never dispatch
* OtherAction, but we do need a default case for the other Actions that are
* dispatched (by third-party plugins and Redux itself). For more information,
* see https://spin.atomicobject.com/2017/07/24/redux-action-pattern-typescript/
*/

export interface OtherAction {
  type: FirebaseActionType.OTHER_ACTION
}

export type FirebaseAction =
AttemptConnectToFirebaseAction
| ConnectToFirebaseSuccessAction
| ConnectToFirebaseFailureAction
| SetFirebaseTokenAction
| LogoutFirebaseAction
| OtherAction

/* Action Creators */

export const attemptConnectToFirebase = (firebaseToken: string): AttemptConnectToFirebaseAction => {
  return {
    type: FirebaseActionType.ATTEMPT_CONNECT_TO_FIREBASE,
    token: firebaseToken,
  }
}

export const setFirebaseToken = (token: string): SetFirebaseTokenAction => {
  return {
    type: FirebaseActionType.SET_FIREBASE_TOKEN,
    token,
  }
}

export const logoutFirebase = (): LogoutFirebaseAction => {
  return {
    type: FirebaseActionType.LOGOUT_FIREBASE,
  }
}
