import 'react-native'
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from '../App'
import { rootReducer } from '../services/rootReducer'

const store = createStore(rootReducer)

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer.create(
    <Provider store={store}>
      <App />
    </Provider>  )
  expect(tree).toBeDefined()
})
