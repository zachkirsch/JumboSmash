import { put, call, takeLatest} from 'redux-saga/effects'
import { api } from '../api'
import { AttemptAcceptCoCAction, AcceptCoCSuccessAction, AcceptCoCFailureAction, CoCActionType } from './actions'

function* handleAcceptCoCError(error: Error) {
  const acceptCoCFailureAction: AcceptCoCFailureAction = {
    type: CoCActionType.ACCEPT_COC_FAILURE,
    errorMessage: error.message,
  }
  yield put(acceptCoCFailureAction)
}

function* acceptCoC(_: AttemptAcceptCoCAction) {
    try {
      yield call(api.acceptCoC)
      const acceptCoCSuccessAction: AcceptCoCSuccessAction = {
        type: CoCActionType.ACCEPT_COC_SUCCESS,
      }
      yield put(acceptCoCSuccessAction)
    } catch (error) {
      yield handleAcceptCoCError(error)
    }
}

export function* cocSaga() {
  yield takeLatest(CoCActionType.ATTEMPT_ACCEPT_COC, acceptCoC)
}
