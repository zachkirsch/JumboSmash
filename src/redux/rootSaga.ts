import { all, fork } from 'redux-saga/effects'
import { authSaga } from '../services/auth'

export function* rootSaga () {
    yield all([
        fork(authSaga),
    ])
}
