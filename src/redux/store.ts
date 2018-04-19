import { Iterable } from 'immutable'
import { AsyncStorage } from 'react-native'
import { Store, applyMiddleware, compose, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import { autoRehydrate, persistStore } from 'redux-persist'
import createSagaMiddleware from 'redux-saga'
import { setRehydrated } from '../services/redux'
import { rootReducer } from './rootReducer'
import { rootSaga } from './rootSaga'
import { RootState } from './types'
import { TokenService } from '../services/api'
import { ChatService } from '../services/firebase'

const sagaMiddleware = createSagaMiddleware()

/* logger */
const logger = createLogger({
  stateTransformer: (state: RootState) => {
    let newState = {...state}
    if (newState.matches && Iterable.isIterable(newState.matches.chats)) {
      newState = {
        ...newState,
        matches: {
          ...newState.matches,
          chats: newState.matches.chats.toJS(),
        },
      }
    }
    if (newState.swipe) {
      newState = {
        ...newState,
        swipe: {
          ...newState.swipe,
          allUsers: {
            ...newState.swipe.allUsers,
            value: newState.swipe.allUsers.value.toJS(),
            prevValue: newState.swipe.allUsers.prevValue && newState.swipe.allUsers.prevValue.toJS(),
          },
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
) as Store<RootState>

persistStore(reduxStore, {storage: AsyncStorage}, () => {
  reduxStore.dispatch(setRehydrated())
})

TokenService.setStore(reduxStore)
ChatService.setStore(reduxStore)
sagaMiddleware.run(rootSaga)
