import { List, Map, Set } from 'immutable'
import { IChatMessage } from 'react-native-gifted-chat'

export type ChatMessage = IChatMessage & {
  createdAt: number
}

export interface NewMatch {
  id: number
  createdAt: string
  conversationId: string
  otherUsers: number[]
}

export interface Conversation {
  matchId: number
  conversationId: string
  otherUsers: number[]
  messages: List<ChatMessage>
  messageIDs: Set<string>
  mostRecentMessage: string
  createdAt: number // Unix timestamp
  messagesUnread: boolean
}

export type MatchPopupSettings = { shouldShow: false } | {
  shouldShow: true
  match: {
    conversationId: string
    otherUsers: number[]
  }
}

export interface MatchesState {
  chats: Map<string, Conversation> /* map from conversation ID to conversation */
  matchPopup: MatchPopupSettings
}
