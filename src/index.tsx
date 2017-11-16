import React, { Component } from 'react'
import { AppRegistry } from 'react-native'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger'
import { rootReducer, rootSaga } from './redux'
import { Main } from './components'

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware, logger)
)
sagaMiddleware.run(rootSaga)

export default class JumboSmash extends Component {
  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    )
  }
}

AppRegistry.registerComponent('JumboSmash', () => JumboSmash)
