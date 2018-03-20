import { combineReducers } from 'redux'
import { authReducer } from '../services/auth'
import { cocReducer } from '../services/coc'
import { reduxReducer } from '../services/redux'
import { firebaseReducer } from '../services/firebase'
import { profileReducer } from '../services/profile'
import { matchesReducer } from '../services/matches'
import { swipeReducer } from '../services/swipe'

export const rootReducer = combineReducers({
    auth: authReducer,
    coc: cocReducer,
    redux: reduxReducer,
    firebase: firebaseReducer,
    profile: profileReducer,
    matches: matchesReducer,
    swipe: swipeReducer,
})
