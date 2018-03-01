import React, { Component } from 'react'
import { AppRegistry } from 'react-native'
import { Provider } from 'react-redux'
import { reduxStore } from './redux'
import App from './App'

// ignore "yellow box" warnings
console.ignoredYellowBox = ['Remote debugger']
console.disableYellowBox = true

export default class JumboSmash extends Component {
  public render() {
    return (
      <Provider store={reduxStore}>
        <App />
      </Provider>
    )
  }
}

AppRegistry.registerComponent('JumboSmash', () => JumboSmash)
