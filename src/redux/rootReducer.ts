import { combineReducers } from 'redux'
import { authReducer } from '../services/auth'
import { cocReducer } from '../services/coc'
import { reduxReducer } from '../services/redux'

export const rootReducer = combineReducers({
    auth: authReducer,
    coc: cocReducer,
    redux: reduxReducer,
})
