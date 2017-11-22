import { call, put, takeLatest } from 'redux-saga/effects'
import api, { ApiFailureResponse, ApiVerifyEmailSuccessResponse } from '../api'
import {
  AttemptLoginAction,
  AttemptVerifyEmailAction,
  AuthActionType,
  LoginSuccessAction,
  LoginFailureAction,
  VerifyEmailSuccessAction,
  VerifyEmailFailureAction,
} from './actions'
import { acceptCoC } from '../coc'

function* login() {
  const loginSuccessAction: LoginSuccessAction = {
    type: AuthActionType.LOGIN_SUCCESS,
  }
  yield put(loginSuccessAction)
}

function* handleLoginError(error: ApiFailureResponse) {
  const loginFailureAction: LoginFailureAction = {
    type: AuthActionType.LOGIN_FAILURE,
    errorMessage: error.errorMessage,
  }
  yield put(loginFailureAction)
}

function* attemptLogin(payload: AttemptLoginAction) {
  try {
    yield call(api.login, payload.credentials)
    // if here, then network call was successful
    yield login()
  } catch (error) {
    yield handleLoginError(error)
  }
}

function* verifyEmail(response: ApiVerifyEmailSuccessResponse) {
  const verifyEmailSuccessAction: VerifyEmailSuccessAction = {
    type: AuthActionType.VERIFY_EMAIL_SUCCESS,
    sessionKey: response.sessionKey,
  }
  yield put(verifyEmailSuccessAction)
}

function* handleEmailVerificationError(error: ApiFailureResponse) {
  const verifyEmailFailureAction: VerifyEmailFailureAction = {
    type: AuthActionType.VERIFY_EMAIL_FAILURE,
    errorMessage: error.errorMessage,
  }
  yield put(verifyEmailFailureAction)
}

function* attemptVerifyEmail(payload: AttemptVerifyEmailAction) {
  try {
    const code = payload.verificationCode
    const response = yield call(api.verifyEmail, code)
    // if here, then network call was successful
    yield verifyEmail(response)
    if (response.acceptedCoC === true) {
      yield put(acceptCoC())
    }
  } catch (error) {
    yield handleEmailVerificationError(error)
  }
}

export function* authSaga() {
  yield takeLatest(AuthActionType.ATTEMPT_LOGIN, attemptLogin)
  yield takeLatest(AuthActionType.ATTEMPT_VERIFY_EMAIL, attemptVerifyEmail)
}
