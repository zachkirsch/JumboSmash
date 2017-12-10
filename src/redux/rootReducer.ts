import { combineReducers } from 'redux'
import { authReducer } from '../services/auth'
import { cocReducer } from '../services/coc'

export const rootReducer = combineReducers({
    auth: authReducer,
    coc: cocReducer,
})
