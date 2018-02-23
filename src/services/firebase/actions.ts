/* Actions */

export enum FirebaseActionType {
    RESTORE_FIREBASE_SESSION = 'RESTORE_FIREBASE_SESSION',
    ATTEMPT_LOAD_FIREBASE_SESSION = 'ATTEMPT_LOAD_FIREBASE_SESSION',
    LOAD_FIREBASE_SESSION_SUCCESS = 'LOAD_FIREBASE_SESSION_SUCCESS',
    LOAD_FIREBASE_SESSION_FAILURE = 'LOAD_FIREBASE_SESSION_FAILURE',
    LOGOUT_FIREBASE_SESSION = 'LOGOUT_FIREBASE_SESSION',
    OTHER_ACTION = '__any_other_action_type__',
}

export interface RestoreFirebaseSessionAction {
    type: FirebaseActionType.RESTORE_FIREBASE_SESSION
}

export interface AttemptLoadFirebaseSessionAction {
    type: FirebaseActionType.ATTEMPT_LOAD_FIREBASE_SESSION
}

export interface LoadFirebaseSessionSuccessAction {
    type: FirebaseActionType.LOAD_FIREBASE_SESSION_SUCCESS
    user: string
}

export interface LoadFirebaseSessionFailureAction {
    type: FirebaseActionType.LOAD_FIREBASE_SESSION_FAILURE
    errorMessage: string
}

export interface LogoutFirebaseSessionAction {
    type: FirebaseActionType.LOGOUT_FIREBASE_SESSION
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
    RestoreFirebaseSessionAction
    | AttemptLoadFirebaseSessionAction
    | LoadFirebaseSessionSuccessAction
    | LoadFirebaseSessionFailureAction
    | LogoutFirebaseSessionAction
    | OtherAction