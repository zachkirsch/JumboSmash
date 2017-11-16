import { combineReducers } from 'redux'
import { applyMiddleware, createStore } from 'redux'
import logger from 'redux-logger'
import auth from './auth'

const rootReducer = combineReducers({
    auth
})

const store = createStore(rootReducer, applyMiddleware(logger))

export default store
