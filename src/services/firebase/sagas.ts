import { call, put, takeLatest } from 'redux-saga/effects'
import {
  AttemptConnectToFirebaseAction,
  ConnectToFirebaseFailureAction,
  ConnectToFirebaseSuccessAction,
  FirebaseActionType,
  LogoutFirebaseAction,
} from './actions'
import { logout } from '../auth'
import { api } from '../api'
import { NotificationsActionType, SetNotificationsTokenAction } from '../notifications/actions'
import firebase from 'react-native-firebase'

function* attemptConnectToFirebase(action: AttemptConnectToFirebaseAction) {
  try {
    const user = yield firebase.auth().signInAndRetrieveDataWithCustomToken(action.token)
    yield call(api.setFirebaseUid, user.user.uid)
    const fcmToken: string = yield firebase.messaging().getToken()
    const notificationsTokenAction: SetNotificationsTokenAction = {
      type: NotificationsActionType.SET_NOTIFICATIONS_TOKEN,
      token: fcmToken,
    }
    yield put(notificationsTokenAction)
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
    yield put(logout()) // since firebase auth failed, log out!
  }
}

function* logoutFirebase(_: LogoutFirebaseAction) {
  yield firebase.auth().signOut()
}

export function* firebaseSaga() {
  yield takeLatest(FirebaseActionType.ATTEMPT_CONNECT_TO_FIREBASE, attemptConnectToFirebase)
  yield takeLatest(FirebaseActionType.LOGOUT_FIREBASE, logoutFirebase)
}
