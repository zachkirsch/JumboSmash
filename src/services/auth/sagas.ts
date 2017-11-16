import { call, put, takeLatest } from 'redux-saga/effects'
import api, {
  ApiLoginSuccessResponse,
  ApiLoginFailureResponse
} from '../api'
import { AttemptLoginAction, AuthActionType } from './actions'
import { Credentials } from './types'

function* login(credentials: Credentials) {
  const response: ApiLoginSuccessResponse = yield call(api.login, credentials)
  yield put({
    type: AuthActionType.LOGIN_SUCCESS,
    sessionKey: response.sessionKey
  })
}

function* handleLoginError(error: ApiLoginFailureResponse) {
  const errorResponse: ApiLoginFailureResponse = error
  yield put({
    type: AuthActionType.LOGIN_FAILURE,
    errorMessage: errorResponse.errorMessage
  })
}

function* fetchUser(payload: AttemptLoginAction) {
  try {
    yield login(payload.credentials)
  } catch (error) {
    yield handleLoginError(error)
  }
}

export function* authSaga() {
  yield takeLatest(AuthActionType.ATTEMPT_LOGIN, fetchUser)
}
