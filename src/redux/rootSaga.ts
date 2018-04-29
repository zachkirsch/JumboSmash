import { all, fork } from 'redux-saga/effects'
import { profileSaga } from '../services/profile'
import { authSaga } from '../services/auth'
import { firebaseSaga } from '../services/firebase'
import { matchesSaga } from '../services/matches'
import { swipeSaga } from '../services/swipe'
import { notificationsSaga } from '../services/notifications'
import { timeSaga } from '../services/time'

export function* rootSaga() {
    yield all([
        fork(authSaga),
        fork(firebaseSaga),
        fork(matchesSaga),
        fork(profileSaga),
        fork(swipeSaga),
        fork(notificationsSaga),
        fork(timeSaga),
    ])
}
