import { List, Map, Set } from 'immutable'

export interface ChatMessage {
  _id: any /* tslint:disable-line:no-any */
  text: string
  createdAt: number
  user: {
    _id: any /* tslint:disable-line:no-any */
    name: string
    avatar: string
  }
  image: string
  sending: boolean
  failedToSend: boolean
  system: false
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
