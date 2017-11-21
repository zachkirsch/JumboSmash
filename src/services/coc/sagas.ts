import { call, takeLatest} from 'redux-saga/effects'
import api from '../api'
import {
  AcceptCoCAction,
  CoCActionType
} from './actions'

function* acceptCoC(_: AcceptCoCAction) {
    yield call(api.acceptCoC) // TODO: handle errors
}

export function* cocSaga() {
  yield takeLatest(CoCActionType.ACCEPT_COC, acceptCoC)
}
