import { call, put, select, takeLatest } from 'redux-saga/effects'
import { Answers } from 'react-native-fabric'
import { api, VerifyEmailResponse, RequestVerificationResponse, MeResponse } from '../api'
import * as AuthActions from './actions'
import { attemptConnectToFirebase, logoutFirebase } from '../firebase'
import { setCoCReadStatus } from '../coc'
import { RootState } from '../../redux'
import { setID } from '../profile'

const getEmail = (state: RootState) => state.auth.email

function* handleRequestVerificationSuccess(isNewUser: boolean) {
  const requestVerificationSuccessAction: AuthActions.RequestVerificationSuccessAction = {
    type: AuthActions.AuthActionType.REQUEST_VERIFICATION_SUCCESS,
    isNewUser,
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
    const response: VerifyEmailResponse = yield call(api.verifyEmail, payload.verificationCode)

    /*
     * before setting the user as 'logged in', update what he/she has done so far
     * (e.g. accepted CoC, seen tutorial)
     */
    yield put(AuthActions.setSessionKey(response.session_key))
    const meInfo: MeResponse = yield call(api.me)
    yield put(setCoCReadStatus(meInfo.accepted_coc))

    // now set the user as 'logged in'
    yield handleEmailVerificationSuccess()

    // set the user's ID
    yield put(setID(meInfo.id))

    // and finally, connect to firebase
    yield put(attemptConnectToFirebase(meInfo.firebase_token))
  } catch (error) {
    loginSuccess = false
    yield handleEmailVerificationError(error)
  }

  // log login with Fabric Answers
  const email = yield select(getEmail)
  yield call(Answers.logLogin, 'Email', loginSuccess, { email })
}

function* logout(_: AuthActions.LogoutAction) {
  yield put(setCoCReadStatus(false))
  yield put(logoutFirebase())
}

export function* authSaga() {
  yield takeLatest(AuthActions.AuthActionType.ATTEMPT_REQUEST_VERIFICATION, attemptRequestVerification)
  yield takeLatest(AuthActions.AuthActionType.ATTEMPT_VERIFY_EMAIL, attemptVerifyEmail)
  yield takeLatest(AuthActions.AuthActionType.LOGOUT, logout)
}
