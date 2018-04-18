import { put, select, takeLatest } from 'redux-saga/effects'
import firebase from 'react-native-firebase'
import {
  SetNotificationsTokenAction,
  NotificationsActionType,
} from './actions'
import { ReduxActionType } from '../redux'
import { RootState } from '../../redux'
import { api } from '../api'

const getLoggedInStatus = (state: RootState) => state.auth.isLoggedIn

function* setToken(payload: SetNotificationsTokenAction) {
  try {
    const isLoggedIn: boolean = yield select(getLoggedInStatus)
    let token = payload.token || ''
    if (!token) {
      token = yield firebase.messaging().getToken()
    }
    if (isLoggedIn) {
      yield api.setFirebaseNotificationToken(token)
    }
  } catch(e) {
    
  }
}

function* onRehydate() {
  const action: SetNotificationsTokenAction = {
    type: NotificationsActionType.SET_NOTIFICATIONS_TOKEN,
  }
  yield put(action)
}

export function* notificationsSaga() {
  yield takeLatest(NotificationsActionType.SET_NOTIFICATIONS_TOKEN, setToken)
  yield takeLatest(ReduxActionType.REHYDRATE, onRehydate)
}
