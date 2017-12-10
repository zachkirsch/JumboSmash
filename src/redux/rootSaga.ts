import { all, fork } from 'redux-saga/effects'
import { authSaga } from '../services/auth'
import { cocSaga } from '../services/coc'

export function* rootSaga () {
    yield all([
        fork(authSaga),
        fork(cocSaga),
    ])
}
