import { put, takeLatest } from 'redux-saga/effects'
import { firebase } from './firebase'
import {
  FirebaseActionType,
  AttemptConnectToFirebaseAction,
  ConnectToFirebaseSuccessAction,
  ConnectToFirebaseFailureAction,
  LogoutFirebaseAction,
} from './actions'

function* attemptConnectToFirebase(action: AttemptConnectToFirebaseAction) {
  try {
    yield firebase.auth().signInWithCustomToken(action.token)
    const successAction: ConnectToFirebaseSuccessAction = {
      type: FirebaseActionType.CONNECT_TO_FIREBASE_SUCCESS,
    }
    yield put(successAction)
  } catch (error) {
    const failureAction: ConnectToFirebaseFailureAction = {
      type: FirebaseActionType.CONNECT_TO_FIREBASE_FAILURE,
      errorMessage: error.message,
    }
    yield put(failureAction)
  }
}

function* logoutFirebase(_: LogoutFirebaseAction) {
  yield firebase.auth().signOut()
}

export function* firebaseSaga() {
  yield takeLatest(FirebaseActionType.ATTEMPT_CONNECT_TO_FIREBASE, attemptConnectToFirebase)
  yield takeLatest(FirebaseActionType.LOGOUT_FIREBASE, logoutFirebase)
}