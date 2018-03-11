import {AsyncStorage} from 'react-native'
import { compose, applyMiddleware, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import { Iterable } from 'immutable'
import createSagaMiddleware from 'redux-saga'
import { autoRehydrate, persistStore } from 'redux-persist'
import { rootSaga } from './rootSaga'
import { rootReducer } from './rootReducer'
import { RootState } from './types'
import { setRehydrated } from '../services/redux'

const sagaMiddleware = createSagaMiddleware()

/* logger */
const logger = createLogger({
  stateTransformer: (state: RootState) => {
    let newState = Object.assign({}, state)
    if (Iterable.isIterable(newState.matches.chats)) {
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
