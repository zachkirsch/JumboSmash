import { call, put, takeLatest } from 'redux-saga/effects'
import api, {
  ApiLoginSuccessResponse,
  ApiLoginFailureResponse
} from '../../api'
import { AttemptLoginAction } from './actions'
import { AuthActionType } from './types'

function* fetchUser(payload: AttemptLoginAction) {
  try {
    const response: ApiLoginSuccessResponse = yield call(
      api.login,
      payload.credentials
    )

    yield put({
      type: AuthActionType.LOGIN_SUCCESS,
      sessionKey: response.sessionKey
    })

  } catch (error) {
    const errorResponse: ApiLoginFailureResponse = error
    yield put({
      type: AuthActionType.LOGIN_FAILURE,
      errorMessage: errorResponse.errorMessage
    })
  }
}

export function* authSaga() {
  yield takeLatest(AuthActionType.ATTEMPT_LOGIN, fetchUser)
}
