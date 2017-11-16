import 'react-native'
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import Main from '../components/Main'
import { rootReducer } from '../redux'

const store = createStore(rootReducer)

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer.create(
    <Provider store={store}>
      <Main />
    </Provider>  )
  expect(tree).toBeDefined()
})
