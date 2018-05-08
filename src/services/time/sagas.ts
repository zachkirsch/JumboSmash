import { call, put, takeLatest } from 'redux-saga/effects'
import moment from 'moment'
import { api, GetServerTimeResponse } from '../api'
import {
  TimeActionType,
  GetServerTimeSuccessAction,
  GetServerTimeFailureAction,
} from './actions'

function* attemptGetServerTime() {
  try {
    const response: GetServerTimeResponse = yield call(api.getServerTime)
    console.log(response)
    const succesAction: GetServerTimeSuccessAction = {
      type: TimeActionType.GET_SERVER_TIME_SUCCESS,
      serverTime: moment(response.time).valueOf(),
      releaseDate: moment(response.release_date).valueOf(),
      postRelease: response.post_release,
      postRelease2: response.post_release_2,
    }
    yield put(succesAction)
  } catch (e) {
    const failureAction: GetServerTimeFailureAction = {
      type: TimeActionType.GET_SERVER_TIME_FAILURE,
      errorMessage: e.message,
    }
    yield put(failureAction)
  }
}

export function* timeSaga() {
  yield takeLatest(TimeActionType.ATTEMPT_GET_SERVER_TIME, attemptGetServerTime)
}
