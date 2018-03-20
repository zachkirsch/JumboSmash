import { all, fork } from 'redux-saga/effects'
import { authSaga } from '../services/auth'
import { cocSaga } from '../services/coc'
import { firebaseSaga } from '../services/firebase'
import { profileSaga } from '../services/profile'
import { matchesSaga } from '../services/matches'
import { swipeSaga } from '../services/swipe'

export function* rootSaga () {
    yield all([
        fork(authSaga),
        fork(cocSaga),
        fork(firebaseSaga),
        fork(profileSaga),
        fork(matchesSaga),
        fork(swipeSaga),
    ])
}
