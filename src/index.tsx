import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import React, { Component } from 'react'
import { AppRegistry } from 'react-native'
import { Provider } from 'react-redux'
import App from './App'
import { reduxStore } from './redux'

// ignore "yellow box" warnings
console.ignoredYellowBox = ['Remote debugger']

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
