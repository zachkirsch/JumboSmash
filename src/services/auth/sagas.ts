import { Answers } from 'react-native-fabric'
import { call, put, select, takeLatest } from 'redux-saga/effects'
import firebase from 'react-native-firebase'
import { RootState } from '../../redux'
import * as api from '../api'
import { attemptConnectToFirebase, logoutFirebase } from '../firebase'
import { clearMatchesState } from '../matches'
import { clearProfileState, initializeProfile } from '../profile'
import { clearSwipeState, fetchAllUsers, fetchSwipableUsers } from '../swipe'
import { clearNavigationState } from '../navigation'
import { NotificationsActionType, SetNotificationsTokenAction } from '../notifications/actions'
import * as AuthActions from './actions'
import { ImageCacheService } from '../image-caching'

const getEmail = (state: RootState) => state.auth.email
const getDeviceId = (state: RootState) => state.auth.deviceId

function* handleRequestVerificationSuccess(isNewUser: boolean, deviceId: string) {
  const requestVerificationSuccessAction: AuthActions.RequestVerificationSuccessAction = {
    type: AuthActions.AuthActionType.REQUEST_VERIFICATION_SUCCESS,
    isNewUser,
    deviceId,
  }
  yield put(requestVerificationSuccessAction)
}

function* handleRequestVerificationError(error: Error) {
  const requestVerificationFailureAction: AuthActions.RequestVerificationFailureAction = {
    type: AuthActions.AuthActionType.REQUEST_VERIFICATION_FAILURE,
    errorMessage: error.message,
  }
  yield put(requestVerificationFailureAction)
}

function* attemptRequestVerification(payload: AuthActions.AttemptRequestVerificationAction) {
  try {
    const response: api.RequestVerificationResponse = yield call(api.api.requestVerification, payload.credentials)
    yield handleRequestVerificationSuccess(response.new_user, response.device_id)

    // if new user, log signup with Answers
    if (response.new_user) {
      Answers.logSignUp('Email', true, { email: payload.credentials.email })
    }
  } catch (error) {
    yield handleRequestVerificationError(error)
  }

}

function* handleEmailVerificationSuccess() {
  const verifyEmailSuccessAction: AuthActions.VerifyEmailSuccessAction = {
    type: AuthActions.AuthActionType.VERIFY_EMAIL_SUCCESS,
  }
  yield put(verifyEmailSuccessAction)
}

function* handleEmailVerificationError(error: Error) {
  const verifyEmailFailureAction: AuthActions.VerifyEmailFailureAction = {
    type: AuthActions.AuthActionType.VERIFY_EMAIL_FAILURE,
    errorMessage: error.message,
  }
  yield put(verifyEmailFailureAction)
}

function* attemptVerifyEmail(payload: AuthActions.AttemptVerifyEmailAction) {

  let loginSuccess = true
  try {
    const deviceId: string = yield select(getDeviceId)
    const response: api.VerifyEmailResponse = yield call(
      api.api.verifyEmail,
      payload.verificationCode,
      deviceId
    )

    /*
     * before setting the user as 'logged in', update what he/she has done so far
     * (e.g. accepted CoC, seen tutorial)
     */
    yield put(AuthActions.setSessionKey(response.session_key))
    const meInfo: api.MeResponse = yield call(api.api.me)
    yield put(AuthActions.setCoCReadStatus(meInfo.accepted_coc))

    // rehydrate the user's profile
    const allTags: api.GetTagsResponse = yield call(api.api.getTags)
    const allReacts: api.GetReactsResponse = yield call(api.api.getReacts)
    yield put(initializeProfile(allTags, allReacts, meInfo))

    // now set the user as 'logged in'
    yield handleEmailVerificationSuccess()

    // fetch users
    yield put(fetchAllUsers())
    yield put(fetchSwipableUsers())

    // connect to firebase
    yield put(attemptConnectToFirebase(meInfo.firebase_token))

    // TODO: tell max about the notification token
    const token: string = yield firebase.messaging().getToken()
    const action: SetNotificationsTokenAction = {
      type: NotificationsActionType.SET_NOTIFICATIONS_TOKEN,
      token,
    }
    yield put(action)
  } catch (error) {
    loginSuccess = false
    yield handleEmailVerificationError(error)
  }

  // log login with Fabric Answers
  const email = yield select(getEmail)
  yield call(Answers.logLogin, 'Email', loginSuccess, { email })
}

function* handleAcceptCoCError(error: Error) {
  const acceptCoCFailureAction: AuthActions.AcceptCoCFailureAction = {
    type: AuthActions.AuthActionType.ACCEPT_COC_FAILURE,
    errorMessage: error.message,
  }
  yield put(acceptCoCFailureAction)
}

function* acceptCoC(_: AuthActions.AttemptAcceptCoCAction) {
    try {
      yield call(api.api.acceptCoC)
      yield put(AuthActions.setCoCReadStatus(true))
    } catch (error) {
      yield handleAcceptCoCError(error)
    }
}

function* logout(_: AuthActions.LogoutAction) {
  yield put(logoutFirebase())
  yield put(clearProfileState())
  yield put(clearNavigationState())
  yield put(clearSwipeState())
  yield put(clearMatchesState())
  ImageCacheService.clearCache()
}

export function* authSaga() {
  yield takeLatest(AuthActions.AuthActionType.ATTEMPT_REQUEST_VERIFICATION, attemptRequestVerification)
  yield takeLatest(AuthActions.AuthActionType.ATTEMPT_VERIFY_EMAIL, attemptVerifyEmail)
  yield takeLatest(AuthActions.AuthActionType.LOGOUT, logout)
  yield takeLatest(AuthActions.AuthActionType.ATTEMPT_ACCEPT_COC, acceptCoC)
}
