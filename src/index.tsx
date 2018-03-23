import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import React, { Component } from 'react'
import { AppRegistry } from 'react-native'
import { Provider } from 'react-redux'
import App from './App'
import { reduxStore } from './redux'

console.ignoredYellowBox = [
  'Remote debugger',
  'Setting a timer for a long period of time, i.e. multiple minutes',
]

export default class JumboSmash extends Component {
  public render() {
    return (
      <Provider store={reduxStore}>
        <ActionSheetProvider>
          <App />
        </ActionSheetProvider>
      </Provider>
    )
  }
}

AppRegistry.registerComponent('JumboSmash', () => JumboSmash)
