import { List, Map, Set } from 'immutable'
import { User } from '../swipe'
import { GetUserResponse } from '../api'

interface BaseMessage {
  _id: string
  text: string
  createdAt: Date // TODO: unix time
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

export interface NewMatch {
  createdAt: number
  conversationId: string
  otherUsers: GetUserResponse[]
}

export interface Conversation {
  conversationId: string
  otherUsers: List<GiftedChatUser>
  messages: List<MessageWithStatus>
  messageIDs: Set<string>
  mostRecentMessage: string
  createdAt: number // Unix timestamp
  messagesUnread: boolean
}

export interface MatchesState {
  chats: Map<string, Conversation> /* map from conversation ID to conversation */
}
