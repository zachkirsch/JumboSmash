import 'react-native'
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { MainScreen } from '../components'
import { rootReducer } from '../redux'

const store = createStore(rootReducer)

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer.create(
    <Provider store={store}>
      <MainScreen />
    </Provider>  )
  expect(tree).toBeDefined()
})
