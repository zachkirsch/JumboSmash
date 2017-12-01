import { call, put, takeLatest } from 'redux-saga/effects'
import { api, VerifyEmailSuccessResponse } from '../api'
import {
  AttemptRequestVerificationAction,
  AttemptVerifyEmailAction,
  AuthActionType,
  RequestVerificationSuccessAction,
  RequestVerificationFailureAction,
  VerifyEmailSuccessAction,
  VerifyEmailFailureAction,
} from './actions'
import { acceptCoC } from '../coc'

function* requestVerification() {
  const requestVerificationSuccessAction: RequestVerificationSuccessAction = {
    type: AuthActionType.REQUEST_VERIFICATION_SUCCESS,
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
    yield call(api.requestVerification, payload.credentials)
    // if here, then network call was successful
    yield requestVerification()
  } catch (error) {
    yield handleRequestVerificationError(error)
  }
}

function* verifyEmail(response: VerifyEmailSuccessResponse) {
  const verifyEmailSuccessAction: VerifyEmailSuccessAction = {
    type: AuthActionType.VERIFY_EMAIL_SUCCESS,
    sessionKey: response.session_key,
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
    const response = yield call(api.verifyEmail, code)
    yield verifyEmail(response)
    if (response.acceptedCoC === true) {
      yield put(acceptCoC())
    }
  } catch (error) {
    yield handleEmailVerificationError(error)
  }
}

export function* authSaga() {
  yield takeLatest(AuthActionType.ATTEMPT_REQUEST_VERIFICATION, attemptRequestVerification)
  yield takeLatest(AuthActionType.ATTEMPT_VERIFY_EMAIL, attemptVerifyEmail)
}
