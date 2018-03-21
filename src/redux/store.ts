import { Iterable } from 'immutable'
import {AsyncStorage} from 'react-native'
import { applyMiddleware, compose, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import { autoRehydrate, persistStore } from 'redux-persist'
import createSagaMiddleware from 'redux-saga'
import { setRehydrated } from '../services/redux'
import { rootReducer } from './rootReducer'
import { rootSaga } from './rootSaga'
import { RootState } from './types'

const sagaMiddleware = createSagaMiddleware()

/* logger */
const logger = createLogger({
  stateTransformer: (state: RootState) => {
    let newState = {...state}
    if (newState.matches && Iterable.isIterable(newState.matches.chats)) {
      newState = {
        ...newState,
        matches: {
          chats: newState.matches.chats.toJS(),
        },
      }
    }
    return newState
  },
})

export const reduxStore = createStore(
  rootReducer,
  undefined,
  compose(
    applyMiddleware(sagaMiddleware, logger),
    autoRehydrate()
  )
)

persistStore(reduxStore, {storage: AsyncStorage}, () => {
  reduxStore.dispatch(setRehydrated())
})

export const getState = (): RootState => reduxStore.getState() as RootState

sagaMiddleware.run(rootSaga)
