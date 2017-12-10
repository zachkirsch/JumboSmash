import { applyMiddleware, createStore } from 'redux'
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from './rootSaga'
import { rootReducer } from './rootReducer'
import { RootState } from './types'

const sagaMiddleware = createSagaMiddleware()

export const reduxStore = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware, logger)
)
export const getState = (): RootState => reduxStore.getState() as RootState

sagaMiddleware.run(rootSaga)
