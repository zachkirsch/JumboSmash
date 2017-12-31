import { call, put, takeLatest } from 'redux-saga/effects'
import { api, VerifyEmailResponse, RequestVerificationResponse, GetUserInfoResponse } from '../api'
import {
  AttemptRequestVerificationAction,
  AttemptVerifyEmailAction,
  AuthActionType,
  RequestVerificationSuccessAction,
  RequestVerificationFailureAction,
  VerifyEmailSuccessAction,
  VerifyEmailFailureAction,
  StoreSessionKeyAction,
} from './actions'
import { setCoCReadStatus } from '../coc'

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
  try {
    const response: VerifyEmailResponse = yield call(api.verifyEmail, payload.verificationCode)
    yield storeSessionKey(response.session_key)

    /*
     * before setting the user as 'logged in', update what he/she has done so far
     * (e.g. accepted CoC, seen tutorial)
     */
    const userInfo: GetUserInfoResponse = yield call(api.getUserInfo)
    yield put(setCoCReadStatus(userInfo.accepted_coc))

    // now set the user as 'logged in'
    yield handleEmailVerificationSuccess()
  } catch (error) {
    yield handleEmailVerificationError(error)
  }
}

export function* authSaga() {
  yield takeLatest(AuthActionType.ATTEMPT_REQUEST_VERIFICATION, attemptRequestVerification)
  yield takeLatest(AuthActionType.ATTEMPT_VERIFY_EMAIL, attemptVerifyEmail)
}
