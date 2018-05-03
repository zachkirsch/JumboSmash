import { Answers } from 'react-native-fabric'
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { RootState } from '../../redux'
import * as api from '../api'
import { attemptConnectToFirebase, logoutFirebase } from '../firebase'
import { clearMatchesState } from '../matches'
import { clearProfileState, initializeProfile } from '../profile'
import { clearSwipeState, fetchAllUsers, fetchSwipableUsers } from '../swipe'
import { isSenior } from '../../utils'
import { clearNavigationState } from '../navigation'
import * as AuthActions from './actions'
import { ImageCacheService } from '../image-caching'

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

function* handleEmailVerificationSuccess(sessionKey: string, classYear: number) {
  const verifyEmailSuccessAction: AuthActions.VerifyEmailSuccessAction = {
    type: AuthActions.AuthActionType.VERIFY_EMAIL_SUCCESS,
    sessionKey,
    classYear,
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

function* attemptLogin() {
  try {
    const meInfo: api.MeResponse = yield call(api.api.me)
    yield put(AuthActions.setCoCReadStatus(meInfo.accepted_coc))

    // rehydrate the user's profile
    const allTags: api.GetTagsResponse = yield call(api.api.getTags)
    const allReacts: api.GetReactsResponse = yield call(api.api.getReacts)
    yield put(initializeProfile(allTags, allReacts, meInfo))
    // fetch users
    yield put(fetchAllUsers())
    yield put(fetchSwipableUsers())

    // connect to firebase
    yield put(attemptConnectToFirebase(meInfo.firebase_token))

    const loginSuccessAction: AuthActions.LoginSuccessAction = {
      type: AuthActions.AuthActionType.LOGIN_SUCCESS,
    }
    yield put(loginSuccessAction)
  } catch (e) {
    const loginFailureAction: AuthActions.LoginFailureAction = {
      type: AuthActions.AuthActionType.LOGIN_FAILURE,
      errorMessage: e.message,
    }
    yield put(loginFailureAction)
  }
}

function* attemptVerifyEmail(payload: AuthActions.AttemptVerifyEmailAction) {
  try {
    const deviceId: string = yield select(getDeviceId)
    let response: api.VerifyEmailResponse  = yield call(
      api.api.verifyEmail,
      payload.verificationCode,
      deviceId
    )

    yield handleEmailVerificationSuccess(response.session_key, response.class_year)
    if (response && isSenior(response.class_year)) {
      yield put(AuthActions.attemptLogin())
    }
  } catch (error) {
    yield handleEmailVerificationError(error)
  }
}

function* confirmNearTufts() {
  yield put(AuthActions.attemptLogin())
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
  try {
    yield call(api.api.logout)
  } catch (e) {} /* tslint:disable-line:no-empty */
  yield put(logoutFirebase())
  yield put(clearProfileState())
  yield put(clearNavigationState())
  yield put(clearSwipeState())
  yield put(clearMatchesState())
  yield put(AuthActions.setSessionKey(''))
  ImageCacheService.clearCache()

}

export function* authSaga() {
  yield takeLatest(AuthActions.AuthActionType.ATTEMPT_REQUEST_VERIFICATION, attemptRequestVerification)
  yield takeLatest(AuthActions.AuthActionType.ATTEMPT_VERIFY_EMAIL, attemptVerifyEmail)
  yield takeLatest(AuthActions.AuthActionType.ATTEMPT_LOGIN, attemptLogin)
  yield takeLatest(AuthActions.AuthActionType.LOGOUT, logout)
  yield takeLatest(AuthActions.AuthActionType.ATTEMPT_ACCEPT_COC, acceptCoC)
  yield takeLatest(AuthActions.AuthActionType.CONFIRM_NEAR_TUFTS, confirmNearTufts)
}
