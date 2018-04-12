import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import React, { Component } from 'react'
import { AppRegistry } from 'react-native'
import { Provider } from 'react-redux'
import firebase, { RemoteMessage } from 'react-native-firebase'
import App from './App'
import { reduxStore } from './redux'

console.ignoredYellowBox = [
  'Remote debugger',
  'Setting a timer for a long period of time, i.e. multiple minutes',
]

export default class JumboSmash extends Component {

  private onTokenRefreshListener: () => any /* tslint:disable-line:no-any */
  private messageListener: () => any /* tslint:disable-line:no-any */
  private notificationDisplayedListener: () => any /* tslint:disable-line:no-any */
  private notificationListener: () => any /* tslint:disable-line:no-any */
  private notificationOpenedListener: () => any /* tslint:disable-line:no-any */

  componentDidMount() {

    firebase.notifications().getInitialNotification()
    .then(notificationOpen => {
      if (notificationOpen) {
          // App was opened by a notification
          // Get the action triggered by the notification being opened
          const action = notificationOpen.action;
          console.log('notification open action', action)

          // Get information about the notification that was opened
          const notification = notificationOpen.notification;
          console.log('notification open', notification)
      }
    })

    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh((fcmToken: string) => {
      console.log('new token', fcmToken)
    })

    this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
      console.log(message)
    })

    this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
      // Process your notification as required
      // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
      console.log('displayed', notification)
    })
    this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
      // Process your notification as required
      console.log('listened!', notification)
    })

    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
      // Get the action triggered by the notification being opened
      const action = notificationOpen.action;
      // Get information about the notification that was opened
      const notification: Notification = notificationOpen.notification;
      console.log('opened action', action)
      console.log('opened notification', notification)
    })

    firebase.messaging().getToken()
    .then(token => console.log(token))

    firebase.messaging().requestPermission()
    .then(() => {
      console.log('user has authorized')
    })
    .catch(error => {
      console.log('user has not authorized', error)
    })

    firebase.messaging().hasPermission()
    .then(enabled => {
      if (enabled) {
        console.log('has permissions')
      } else {
        console.log('DOES NOT HAVE permissions')
      }
    })
  }

  componentWillUnmount() {
    this.onTokenRefreshListener()
    this.messageListener()
    this.notificationDisplayedListener()
    this.notificationListener()
    this.notificationOpenedListener()
  }

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

const handleBackgroundMessage = (message: RemoteMessage) => {
  console.log('remote message: ', message)
  return Promise.resolve()
}

AppRegistry.registerComponent('JumboSmash', () => JumboSmash)
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => handleBackgroundMessage)
