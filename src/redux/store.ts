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
import { ApiAuthService } from '../services/api'
import { ChatService } from '../services/firebase'

const sagaMiddleware = createSagaMiddleware()

/* logger */
const logger = createLogger({
  stateTransformer: (state: RootState) => {
    let newState = {...state}
    if (newState.profile && Iterable.isIterable(newState.profile.images)) {
      newState = {
        ...newState,
        profile: {
          ...newState.profile,
          images: newState.profile.images.toJS(),
        },
      }
    }
    if (newState.profile && Iterable.isIterable(newState.profile.tags)) {
      newState = {
        ...newState,
        profile: {
          ...newState.profile,
          tags: newState.profile.images.toJS(),
        },
      }
    }
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
      if (Iterable.isIterable(newState.swipe.swipableUsers.value)) {
        newState = {
          ...newState,
          swipe: {
            ...newState.swipe,
            swipableUsers: {
              ...newState.swipe.swipableUsers,
              value: newState.swipe.swipableUsers.value.toJS(),
              prevValue: newState.swipe.swipableUsers.prevValue && newState.swipe.swipableUsers.prevValue.toJS(),
            },
          },
        }
      }
      if (Iterable.isIterable(newState.swipe.allUsers.value)) {
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

ApiAuthService.setStore(reduxStore)
ChatService.setStore(reduxStore)
sagaMiddleware.run(rootSaga)
