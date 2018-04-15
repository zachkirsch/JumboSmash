import { combineReducers } from 'redux'
import { authReducer } from '../services/auth'
import { cocReducer } from '../services/coc'
import { firebaseReducer } from '../services/firebase'
import { matchesReducer } from '../services/matches'
import { profileReducer } from '../services/profile'
import { reduxReducer } from '../services/redux'
import { swipeReducer } from '../services/swipe'
import { navigationReducer } from '../services/navigation'
import { tutorialReducer } from '../services/tutorial'

export const rootReducer = combineReducers({
    auth: authReducer,
    coc: cocReducer,
    tutorial: tutorialReducer,
    redux: reduxReducer,
    firebase: firebaseReducer,
    profile: profileReducer,
    matches: matchesReducer,
    swipe: swipeReducer,
    navigation: navigationReducer,
})
