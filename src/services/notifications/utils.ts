import { setNotificationsToken } from './actions'
import firebase from 'react-native-firebase'
import moment from 'moment'
import { reduxStore } from '../../redux'
import { ChatService } from '../firebase'
import { unmatch } from '../matches'
import { addInAppNotification } from './actions'
import { Match, GetUserResponse } from '../api'

/* tslint:disable:no-console */

interface NewMatchNotification {
  msg_type: 'new_match'
  match: Match
  other_users: GetUserResponse[]
}

interface UnmatchDataMessage {
  msg_type: 'unmatch'
  conversation_uuid: string
  match_id: number
}

type DataMessage = UnmatchDataMessage

type Notification = NewMatchNotification

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

export const setupNotifications = () => {
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
    console.log(message, message.data, message._data)
    try {
      const data: DataMessage = JSON.parse(message._data.data)
      console.log(data)
      switch (data.msg_type) {
        case 'unmatch':
          reduxStore.dispatch(unmatch(data.match_id, data.conversation_uuid))
          break
      }
    } catch (e) {
      console.log(e)
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
    try {
      const data: Notification = JSON.parse(notification._data.data)
      console.log(data)
      switch (data.msg_type) {
        case 'new_match':
          const otherUsers = data.match.users.filter(u => u.id !== reduxStore.getState().profile.id)
          ChatService.createChat(
            data.match.id,
            data.match.conversation_uuid,
            moment(data.match.createdAt).valueOf(),
            otherUsers
          )
          const otherUser = otherUsers[0]
          reduxStore.dispatch(addInAppNotification(
            `You matched with ${otherUser.preferred_name}!`,
            `Tap to start chatting`,
            otherUser.images[0].url,
            data.match.conversation_uuid
          ))
          break
      }
    } catch (e) {
      console.log(e)
      // TODO: Query for new matches
    }
  })

  notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
    // Get the action triggered by the notification being opened
    const action = notificationOpen.action
    // Get information about the notification that was opened
    const notification = notificationOpen.notification
    console.log('opened action', action)
    console.log('opened notification', notification)
    try {
      const data: Notification = JSON.parse(notification._data.data)
      console.log(data)
      switch (data.msg_type) {
        case 'new_match':
          const otherUsers = data.match.users.filter(u => u.id !== reduxStore.getState().profile.id)
          ChatService.createChat(
            data.match.id,
            data.match.conversation_uuid,
            moment(data.match.createdAt).valueOf(),
            otherUsers,
            true
          )
          break
      }
    } catch (e) {
      console.log(e)
      // TODO: Query for new matches
    }
  })
}
/* TODO: delete
export const requestPermissions = () => {
  firebase.messaging().requestPermission()
  .then(() => {
    console.log('user has authorized')
  })
  .catch(error => {
    console.log('user has not authorized', error)
  })
}

export const hasPermissions = () => {
  firebase.messaging().hasPermission()
  .then(enabled => {
    if (enabled) {
      console.log('has permissions')
    } else {
      console.log('DOES NOT HAVE permissions')
    }
  })
}
*/
/* tslint:enable:no-console */
