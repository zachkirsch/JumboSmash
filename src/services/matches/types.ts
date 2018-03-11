import { IMessage } from 'react-native-gifted-chat'
import { Map, List } from 'immutable'

export type Message = IMessage & {
  sending: boolean
  failedToSend: boolean
  sent: boolean
  received: boolean
  read: boolean
}

export interface User {
  _id: number
  name: string
  avatar: string
}

export interface Conversation {
  conversationId: string
  otherUsers: List<User>
  messages: List<Message>
  mostRecentMessage: string
  messagesUnread: boolean
}

export interface MatchesState {
  chats: Map<string, Conversation> /* map from conversation ID to conversation */
}
