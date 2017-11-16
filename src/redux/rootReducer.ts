import { combineReducers } from 'redux'
import { authReducer } from '../services/auth'

export const rootReducer = combineReducers({
    auth: authReducer
})
