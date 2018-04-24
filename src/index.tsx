import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import React, { PureComponent } from 'react'
import { AppRegistry as TypedAppRegistry, Platform } from 'react-native'
import { Provider } from 'react-redux'
import { ImageCacheProvider } from 'react-native-cached-image'
import App from './App'
import { reduxStore } from './redux'
import { setupNotifcations, turnOffListeners, handleBackgroundMessageAndroid } from './services/notifications'

console.ignoredYellowBox = [
  'Remote debugger',
  'Setting a timer for a long period of time, i.e. multiple minutes',
]

/* tslint:disable */
const AppRegistry: any = TypedAppRegistry
/* tslint:enable */

class JumboSmash extends PureComponent {

  componentDidMount() {
    setupNotifcations()
  }

  componentWillUnmount() {
    turnOffListeners()
  }

  public render() {

    return (
      <Provider store={reduxStore}>
        <ActionSheetProvider>
          <ImageCacheProvider>
            <App />
          </ImageCacheProvider>
        </ActionSheetProvider>
      </Provider>
    )
  }
}

AppRegistry.registerComponent('JumboSmash', () => JumboSmash)

if (Platform.OS === 'android') {
  AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', handleBackgroundMessageAndroid)
}
