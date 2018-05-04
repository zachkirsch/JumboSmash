import { setNotificationsToken } from './actions'
import firebase from 'react-native-firebase'
import { reduxStore } from '../../redux'
import { ChatService } from '../firebase'
import { unmatch, removeChat } from '../matches'
import { updateProfileReacts } from '../profile'
import { addInAppNotification } from './actions'
import { ProfileReact, GetUserResponse } from '../api'
import { NavigationService } from '../navigation'

/* tslint:disable:no-console */

interface NewMatchMessage {
  msg_type: 'new_match'
  match_id: number
  conversation_uuid: string
  createdAt: string
  users: number[]
}

interface NewChatMessage {
  msg_type: 'new_chat'
  message: string
  from_user: GetUserResponse
  conversation_uuid: string
}

interface ReactMessage {
  msg_type: 'react',
  profile_reacts: ProfileReact[]
}

interface UnmatchMessage {
  msg_type: 'unmatch'
  conversation_uuid: string
  match_id: number
}

interface DeactivateMessage {
  msg_type: 'deactivate'
  conversation_uuid: string
  match_id: number
  user_id: number
}

interface ReactivateMessage {
  msg_type: 'reactivate'
  match_id: number
  conversation_uuid: string
  createdAt: string
  users: number[]
}

interface GeneralNotification {
  msg_type: 'general'
  title: string
  subtitle?: string
}

type DataMessage = UnmatchMessage | NewMatchMessage | ReactMessage | DeactivateMessage | ReactivateMessage

type Notification = NewMatchMessage | NewChatMessage | GeneralNotification

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

  messageListener = firebase.messaging().onMessage(onMessage)

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
          const otherUsers = data.users.filter(id => id !== reduxStore.getState().profile.id)
          const otherUser = reduxStore.getState().swipe.allUsers.value.get(otherUsers[0])
            reduxStore.dispatch(addInAppNotification({
              type: 'chat',
              title: `You matched with ${otherUser.preferredName}!`,
              subtitle: `Tap to start chatting`,
              imageUri: otherUser.images[0],
              conversationId: data.conversation_uuid,
            }))
          break
        case 'new_chat':
          if (!NavigationService.chatIsOpen(data.conversation_uuid)) {
            reduxStore.dispatch(addInAppNotification({
              type: 'chat',
              title: `New message from ${data.from_user.preferred_name}`,
              subtitle: data.message,
              imageUri: data.from_user.images[0].url,
              conversationId: data.conversation_uuid,
            }))
          }
          break
        case 'general':
          reduxStore.dispatch(addInAppNotification({
            type: 'actionless',
            title: data.title,
            subtitle: data.subtitle || '',
          }))
          break
      }
    } catch (e) {} /* tslint:disable-line:no-empty */
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
        case 'new_chat':
          NavigationService.openChat(data.conversation_uuid)
          break
      }
    } catch (e) {} /* tslint:disable-line:no-empty */
  })
}

/* tslint:disable-next-line:no-any */
const onMessage = (message: any) => {
  console.log(message, message.data, message._data)
  try {
    const data: DataMessage = JSON.parse(message._data.data)
    console.log(data)
    switch (data.msg_type) {
      case 'unmatch':
        NavigationService.popChatIfOpen(data.conversation_uuid)
        reduxStore.dispatch(unmatch(data.match_id, data.conversation_uuid))
        break
      case 'deactivate':
        NavigationService.popChatIfOpen(data.conversation_uuid)
        ChatService.stopListeningToChat(data.conversation_uuid)
        reduxStore.dispatch(removeChat(data.conversation_uuid))
        break
      case 'new_match':
      case 'reactivate':
        const otherUsers = data.users.filter(id => id !== reduxStore.getState().profile.id)
        ChatService.createChat(
          data.match_id,
          data.conversation_uuid,
          data.createdAt,
          otherUsers,
          false
        )
        break
      case 'react':
        reduxStore.dispatch(updateProfileReacts(data.profile_reacts))
    }
  } catch (e) {} /* tslint:disable-line:no-empty */
}
