import { List, Map, Set } from 'immutable'
import { User } from '../swipe'
import { IChatMessage } from 'react-native-gifted-chat'

export interface Conversation {
  conversationId: string
  otherUsers: List<User>
  messages: List<IChatMessage>
  messageIDs: Set<string>
  mostRecentMessage: string
  messagesUnread: boolean
}

export interface MatchesState {
  chats: Map<string, Conversation> /* map from conversation ID to conversation */
}
