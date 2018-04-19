import { setNotificationsToken } from './actions'
import firebase from 'react-native-firebase'
import { reduxStore } from '../../redux'
import { ChatService } from '../firebase'
import { GetUserResponse } from '../api'
import { Match } from '../swipe'

/* tslint:disable:no-console */

interface NewMatchMessage {
  msg_type: 'new_match'
  match: Match
  other_users: GetUserResponse[]
}

type Message = NewMatchMessage

const dummy = () => {} /* tslint:disable-line:no-empty */

let onTokenRefreshListener = dummy
let messageListener = dummy
let notificationDisplayedListener = dummy
let notificationListener = dummy
let notificationOpenedListener = dummy

/* tslint:disable-next-line:no-any */
export const handleBackgroundMessageAndroid = (message: any) => {
  console.log('background message android: ', message)
  return Promise.resolve()
}

export const turnOffListeners = () => {
  onTokenRefreshListener()
  messageListener()
  notificationDisplayedListener()
  notificationListener()
  notificationOpenedListener()
}

export const setupNotifcations = () => {
  firebase.notifications().getInitialNotification()
  .then(notificationOpen => {
    if (notificationOpen) {
        // App was opened by a notification
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action
        console.log('notification open action', action)

        // Get information about the notification that was opened
        const notification = notificationOpen.notification
        console.log('notification open', notification)
    }
  })

  onTokenRefreshListener = firebase.messaging().onTokenRefresh((fcmToken: string) => {
    console.log('here!')
    reduxStore.dispatch(setNotificationsToken(fcmToken))
  })

  messageListener = firebase.messaging().onMessage(message => {
    try {
      const data: Message = JSON.parse(message.data.data)
      switch (data.msg_type) {
        case 'new_match':
          ChatService.createChat(data.match.conversation_uuid, data.other_users.map(user => ({
            id: user.id,
            preferredName: user.preferred_name || '',
            surname: user.surname,
            fullName: user.full_name,
            major: user.major,
            bio: user.bio,
            images: user.images.map(image => image.url),
            tags: [],
          })))
      }
    } catch (e) {
      // TODO: Query for new matches
    }
  })

  notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
    // Process your notification as required
    // ANDROID: Remote notifications do not contain the channel ID.
    // You will have to specify this manually if you'd like to re-display the notification.
    console.log('displayed', notification)
  })

  notificationListener = firebase.notifications().onNotification((notification) => {
    // Process your notification as required
    console.log('listened!', notification)
  })

  notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
    // Get the action triggered by the notification being opened
    const action = notificationOpen.action
    // Get information about the notification that was opened
    const notification = notificationOpen.notification
    console.log('opened action', action)
    console.log('opened notification', notification)
  })

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
/* tslint:enable:no-console */
