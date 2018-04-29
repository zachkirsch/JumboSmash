import { List } from 'immutable'

export interface InAppNotification {
  id: number
  title: string
  subtitle: string
  imageUri: string
  conversationId: string
}

export interface NotificationsState {
  inAppNotifications: List<InAppNotification>
}
