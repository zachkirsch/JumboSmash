import { combineReducers } from 'redux'
import { authReducer } from '../services/auth'
import { firebaseReducer } from '../services/firebase'
import { matchesReducer } from '../services/matches'
import { profileReducer } from '../services/profile'
import { reduxReducer } from '../services/redux'
import { swipeReducer } from '../services/swipe'
import { navigationReducer } from '../services/navigation'
import { notificationsReducer } from '../services/notifications'
import { timeReducer } from '../services/time'

export const rootReducer = combineReducers({
    auth: authReducer,
    redux: reduxReducer,
    firebase: firebaseReducer,
    profile: profileReducer,
    matches: matchesReducer,
    swipe: swipeReducer,
    navigation: navigationReducer,
    notifications: notificationsReducer,
    time: timeReducer,
})
