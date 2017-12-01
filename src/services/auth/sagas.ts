import { call, put, takeLatest } from 'redux-saga/effects'
import { api, VerifyEmailResponse, RequestVerificationResponse } from '../api'
import {
  AttemptRequestVerificationAction,
  AttemptVerifyEmailAction,
  AuthActionType,
  RequestVerificationSuccessAction,
  RequestVerificationFailureAction,
  VerifyEmailSuccessAction,
  VerifyEmailFailureAction,
} from './actions'

function* requestVerification(isNewUser: boolean) {
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
    yield requestVerification(response.new_user)
  } catch (error) {
    yield handleRequestVerificationError(error)
  }
}

function* verifyEmail(sessionKey: string) {
  const verifyEmailSuccessAction: VerifyEmailSuccessAction = {
    type: AuthActionType.VERIFY_EMAIL_SUCCESS,
    sessionKey,
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
    const code = payload.verificationCode
    const response: VerifyEmailResponse = yield call(api.verifyEmail, code)
    yield verifyEmail(response.session_key)
  } catch (error) {
    yield handleEmailVerificationError(error)
  }
}

export function* authSaga() {
  yield takeLatest(AuthActionType.ATTEMPT_REQUEST_VERIFICATION, attemptRequestVerification)
  yield takeLatest(AuthActionType.ATTEMPT_VERIFY_EMAIL, attemptVerifyEmail)
}
