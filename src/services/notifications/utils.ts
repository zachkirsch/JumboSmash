import { setNotificationsToken } from './actions'
import firebase from 'react-native-firebase'
import { reduxStore } from '../../redux'
import { ChatService } from '../firebase'
import { unmatch, removeChat } from '../matches'
import { rehydrateProfileFromServer } from '../profile'
import { addInAppNotification } from './actions'
import { removeUser } from '../swipe'
import { GetUserResponse } from '../api'
import { NavigationService } from '../navigation'

interface NewChatMessage {
  msg_type: 'new_chat'
  message: string
  from_user: GetUserResponse
  conversation_uuid: string
}

interface ReactMessage {
  msg_type: 'react'
}

interface UnmatchMessage {
  msg_type: 'unmatch'
  conversation_uuid: string
  match_id: number
}

interface RemoveMatchMessage {
  msg_type: 'remove_match'
  conversation_uuid: string
  user_to_remove: number | null
}

interface AddMatchMessage {
  msg_type: 'add_match' | 'new_match'
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

type DataMessage = UnmatchMessage
| ReactMessage
| RemoveMatchMessage
| AddMatchMessage

type Notification = AddMatchMessage | NewChatMessage | GeneralNotification

const dummy = () => {} /* tslint:disable-line:no-empty */

let onTokenRefreshListener = dummy
let messageListener = dummy
let notificationDisplayedListener = dummy
let notificationListener = dummy
let notificationOpenedListener = dummy

/* tslint:disable-next-line:no-any */
export async function handleBackgroundMessageAndroid(message: any) {
    // handle your message
    onMessage(message)
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
        // const action = notificationOpen.action

        // Get information about the notification that was opened
        // const notification = notificationOpen.notification
    }
  })

  onTokenRefreshListener = firebase.messaging().onTokenRefresh((fcmToken: string) => {
    reduxStore.dispatch(setNotificationsToken(fcmToken))
  })

  messageListener = firebase.messaging().onMessage(onMessage)

  notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((_) => {
    // Process your notification as required
    // ANDROID: Remote notifications do not contain the channel ID.
    // You will have to specify this manually if you'd like to re-display the notification.
  })

  notificationListener = firebase.notifications().onNotification((notification) => {
    // Process your notification as required
    try {
      const data: Notification = JSON.parse(notification._data.data)
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
    } catch (e) {
    } /* tslint:disable-line:no-empty */
  })

  notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
    // Get the action triggered by the notification being opened
    // const action = notificationOpen.action
    // Get information about the notification that was opened
    const notification = notificationOpen.notification
    try {
      const data: Notification = JSON.parse(notification._data.data)
      switch (data.msg_type) {
        case 'new_match':
        case 'new_chat':
          NavigationService.openChat(data.conversation_uuid)
          break
      }
    } catch (e) {
    } /* tslint:disable-line:no-empty */
  })
}

/* tslint:disable-next-line:no-any */
const onMessage = (message: any) => {
  const dataToParse = message.data || message._data
  if (dataToParse === undefined) {
    return
  }
  try {
    const data: DataMessage = JSON.parse(dataToParse.data)
    switch (data.msg_type) {
      case 'unmatch':
        NavigationService.popChatIfOpen(data.conversation_uuid)
        reduxStore.dispatch(unmatch(data.match_id, data.conversation_uuid))
        break
      case 'remove_match':
        NavigationService.popChatIfOpen(data.conversation_uuid)
        ChatService.stopListeningToChat(data.conversation_uuid)
        reduxStore.dispatch(removeChat(data.conversation_uuid))
        if (data.user_to_remove) {
          reduxStore.dispatch(removeUser(data.user_to_remove))
        }
        break
      case 'add_match':
      case 'new_match':
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
        reduxStore.dispatch(rehydrateProfileFromServer())
        break
    }
  } catch (e) {
  } /* tslint:disable-line:no-empty */
}
