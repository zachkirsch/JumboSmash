import { Map, List, Set } from 'immutable'
import { LoadableValue } from '../redux'

interface BaseMessage {
  _id: string
  text: string
  createdAt: Date
}

export interface ChatMessage extends BaseMessage {
  user: User
  image?: string
  system: false
}

export interface SystemMessage extends BaseMessage {
  system: true
}

export type GiftedChatMessage = SystemMessage | ChatMessage

export type MessageWithStatus = GiftedChatMessage & {
  sending: boolean
  failedToSend: boolean
}

export interface GiftedChatUser {
  _id: number
  name: string
  avatar: string
}

export interface User {
  id: number
  preferredName: string
  bio: string
  images: string[]
}

export interface Match {
  conversation_uuid: string
  createdAt: string
  id: number
  unmatched: boolean
}

export interface Conversation {
  conversationId: string
  otherUsers: List<GiftedChatUser>
  messages: List<MessageWithStatus>
  messageIDs: Set<string>
  mostRecentMessage: string
  messagesUnread: boolean
}

export interface MatchesState {
  allUsers: LoadableValue<List<User>>
  chats: Map<string, Conversation> /* map from conversation ID to conversation */
}
