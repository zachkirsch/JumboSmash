import { List, Map, Set } from 'immutable'
import { GetUserResponse } from '../api'
import { IChatMessage } from 'react-native-gifted-chat'

export interface NewMatch {
  createdAt: number
  conversationId: string
  otherUsers: GetUserResponse[]
}

export interface Conversation {
  conversationId: string
  otherUsers: number[]
  messages: List<IChatMessage>
  messageIDs: Set<string>
  mostRecentMessage: string
  createdAt: number // Unix timestamp
  messagesUnread: boolean
}

export interface MatchesState {
  chats: Map<string, Conversation> /* map from conversation ID to conversation */
}
