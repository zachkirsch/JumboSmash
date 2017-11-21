import { call, put, takeLatest } from 'redux-saga/effects'
import api, { ApiFailureResponse } from '../api'
import {
  AttemptLoginAction,
  AttemptVerifyEmailAction,
  AuthActionType
} from './actions'

import { CoCActionType } from '../coc'
import { Credentials } from './types'

function* login(credentials: Credentials) {
  yield call(api.login, credentials)
  yield put({
    type: AuthActionType.LOGIN_SUCCESS,
  })
}

function* handleLoginError(error: ApiFailureResponse) {
  yield put({
    type: AuthActionType.LOGIN_FAILURE,
    errorMessage: error.errorMessage,
  })
}

function* attemptLogin(payload: AttemptLoginAction) {
  try {
    yield login(payload.credentials)
  } catch (error) {
    yield handleLoginError(error)
  }
}

function* verifyEmail(verificationCode: string) {
  const response = yield call(api.verifyEmail, verificationCode)
  if (response.acceptedCoC === true) {
    yield put({
      type: CoCActionType.ACCEPT_COC,
    })
  }
  yield put({
    type: AuthActionType.VERIFY_EMAIL_SUCCESS,
    sessionKey: response.sessionKey,
  })
}

function* handleEmailVerificationError(error: ApiFailureResponse) {
  yield put({
    type: AuthActionType.VERIFY_EMAIL_FAILURE,
    errorMessage: error.errorMessage,
  })
}

function* attemptVerifyEmail(payload: AttemptVerifyEmailAction) {
  try {
    yield verifyEmail(payload.verificationCode)
  } catch (error) {
    yield handleEmailVerificationError(error)
  }
}

export function* authSaga() {
  yield takeLatest(AuthActionType.ATTEMPT_LOGIN, attemptLogin)
  yield takeLatest(AuthActionType.ATTEMPT_VERIFY_EMAIL, attemptVerifyEmail)
}
