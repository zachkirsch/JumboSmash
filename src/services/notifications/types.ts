import { List } from 'immutable'

export interface ChatInAppNotification {
  type: 'chat'
  imageUri: string
  conversationId: string
}

export interface ActionlessInAppNotification {
  type: 'actionless'
}

export type InAppNotificationWithoutId = (ChatInAppNotification | ActionlessInAppNotification) & {
  title: string
  subtitle: string
}

export type InAppNotification = InAppNotificationWithoutId & {
  id: number
}

export interface NotificationsState {
  inAppNotifications: List<InAppNotification>
}
