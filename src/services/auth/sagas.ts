import { call, put, select, takeLatest } from 'redux-saga/effects'
import { Answers } from 'react-native-fabric'
import { api, VerifyEmailResponse, RequestVerificationResponse, MeResponse } from '../api'
import {
  AttemptRequestVerificationAction,
  AttemptVerifyEmailAction,
  AuthActionType,
  RequestVerificationSuccessAction,
  RequestVerificationFailureAction,
  VerifyEmailSuccessAction,
  VerifyEmailFailureAction,
  StoreSessionKeyAction,
  LogoutAction,
} from './actions'
import { attemptConnectToFirebase, logoutFirebase } from '../firebase'
import { setCoCReadStatus } from '../coc'
import { RootState } from '../../redux'

const getEmail = (state: RootState) => state.auth.email

function* handleRequestVerificationSuccess(isNewUser: boolean) {
  const requestVerificationSuccessAction: RequestVerificationSuccessAction = {
    type: AuthActionType.REQUEST_VERIFICATION_SUCCESS,
    isNewUser,
  }
  yield put(requestVerificationSuccessAction)
}

function* handleRequestVerificationError(error: Error) {
  const requestVerificationFailureAction: RequestVerificationFailureAction = {
    type: AuthActionType.REQUEST_VERIFICATION_FAILURE,
    errorMessage: error.message,
  }
  yield put(requestVerificationFailureAction)
}

function* attemptRequestVerification(payload: AttemptRequestVerificationAction) {
  try {
    const response: RequestVerificationResponse = yield call(api.requestVerification, payload.credentials)
    yield handleRequestVerificationSuccess(response.new_user)

    // if new user, log signup with Answers
    if (response.new_user) {
      Answers.logSignUp('Email', true, { email: payload.credentials.email })
    }
  } catch (error) {
    yield handleRequestVerificationError(error)
  }

}

function* storeSessionKey(sessionKey: string) {
  const storeSessionKeyAction: StoreSessionKeyAction = {
    type: AuthActionType.STORE_SESSION_KEY,
    sessionKey,
  }
  yield put(storeSessionKeyAction)
}

function* handleEmailVerificationSuccess() {
  const verifyEmailSuccessAction: VerifyEmailSuccessAction = {
    type: AuthActionType.VERIFY_EMAIL_SUCCESS,
  }
  yield put(verifyEmailSuccessAction)
}

function* handleEmailVerificationError(error: Error) {
  const verifyEmailFailureAction: VerifyEmailFailureAction = {
    type: AuthActionType.VERIFY_EMAIL_FAILURE,
    errorMessage: error.message,
  }
  yield put(verifyEmailFailureAction)
}

function* attemptVerifyEmail(payload: AttemptVerifyEmailAction) {

  let loginSuccess = true

  try {
    const response: VerifyEmailResponse = yield call(api.verifyEmail, payload.verificationCode)
    yield storeSessionKey(response.session_key)

    /*
     * before setting the user as 'logged in', update what he/she has done so far
     * (e.g. accepted CoC, seen tutorial)
     */
    const userInfo: MeResponse = yield call(api.me)
    yield put(setCoCReadStatus(userInfo.accepted_coc))

    // now set the user as 'logged in'
    yield handleEmailVerificationSuccess()

    // connect to firebase
    yield put(attemptConnectToFirebase(userInfo.firebase_token))

  } catch (error) {
    loginSuccess = false
    yield handleEmailVerificationError(error)
  }

  // log login with Fabric Answers
  const email = yield select(getEmail)
  yield call(Answers.logLogin, 'Email', loginSuccess, { email })
}

function* logout(_: LogoutAction) {
  yield put(logoutFirebase())
}

export function* authSaga() {
  yield takeLatest(AuthActionType.ATTEMPT_REQUEST_VERIFICATION, attemptRequestVerification)
  yield takeLatest(AuthActionType.ATTEMPT_VERIFY_EMAIL, attemptVerifyEmail)
  yield takeLatest(AuthActionType.LOGOUT, logout)
}
