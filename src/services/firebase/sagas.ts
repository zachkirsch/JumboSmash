import { call, put, select, takeLatest } from 'redux-saga/effects'
import firebase from 'react-native-firebase'
import {
  AttemptConnectToFirebaseAction,
  ConnectToFirebaseFailureAction,
  ConnectToFirebaseSuccessAction,
  FirebaseActionType,
  LogoutFirebaseAction,
} from './actions'
import { attemptLogin, logout } from '../auth'
import { api } from '../api'
import { ChatService } from './utils'
import { RootState } from '../../redux'
import { NotificationsActionType, SetNotificationsTokenAction } from '../notifications/actions'

const getConversationIds = (state: RootState): string[] => state.matches.chats.keySeq().toArray()

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
    const conversationIds: string[] = yield select(getConversationIds)
    conversationIds.forEach(conversationId => ChatService.listenForNewChats(conversationId))
    const successAction: ConnectToFirebaseSuccessAction = {
      type: FirebaseActionType.CONNECT_TO_FIREBASE_SUCCESS,
    }
    yield put(successAction)
    yield put(attemptLogin())
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
