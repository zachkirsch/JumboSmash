import { RehydrateAction } from '../redux'
import { NewMatch, ChatMessage } from './types'

/* Actions */

export enum MatchesActionType {
  CREATE_MATCH = 'CREATE_MATCH',
  DISMISS_MATCH_POPUP = 'DISMISS_MATCH_POPUP',

  ATTEMPT_SEND_MESSAGES = 'ATTEMPT_SEND_MESSAGES',
  SEND_MESSAGES_SUCCESS = 'SEND_MESSAGES_SUCCESS',
  SEND_MESSAGES_FAILURE = 'SEND_MESSAGES_FAILURE',
  RECEIVE_MESSAGES = 'RECEIVE_MESSAGES',
  SET_CONVERSATION_AS_READ = 'SET_CONVERSATION_AS_READ',

  REHYDRATE_MATCHES_FROM_SERVER = 'REHYDRATE_MATCHES_FROM_SERVER',
  UNMATCH = 'UNMATCH',
  REMOVE_CHAT = 'REMOVE_CHAT',

  CLEAR_MATCHES_STATE = 'CLEAR_MATCHES_STATE',
  OTHER_ACTION = '__any_other_action_type__',
}

export interface CreateMatchAction extends NewMatch {
  type: MatchesActionType.CREATE_MATCH
  shouldShowMatchPopup: boolean
}

export interface DismissMatchPopupAction {
  type: MatchesActionType.DISMISS_MATCH_POPUP
}

export interface AttemptSendMessagesAction {
  type: MatchesActionType.ATTEMPT_SEND_MESSAGES
  conversationId: string
  messages: ChatMessage[]
}

export interface SendMessagesSuccessAction {
  type: MatchesActionType.SEND_MESSAGES_SUCCESS
  conversationId: string
  messages: ChatMessage[]
}

export interface SendMessagesFailureAction {
  type: MatchesActionType.SEND_MESSAGES_FAILURE
  conversationId: string
  messages: ChatMessage[]
  errorMessage: string
}

export interface ReceiveMessagesAction {
  type: MatchesActionType.RECEIVE_MESSAGES
  conversationId: string
  messages: ChatMessage[]
}

export interface SetConversationAsReadAction {
  type: MatchesActionType.SET_CONVERSATION_AS_READ
  conversationId: string
}

export interface UnmatchAction {
  type: MatchesActionType.UNMATCH
  matchId: number
  conversationId: string
}

export interface RemoveChatAction {
  type: MatchesActionType.REMOVE_CHAT
  conversationId: string
}

export interface RehydrateMatchesFromServerAction {
  type: MatchesActionType.REHYDRATE_MATCHES_FROM_SERVER,
  matches: NewMatch[]
}

export interface ClearMatchesStateAction {
  type: MatchesActionType.CLEAR_MATCHES_STATE
}

/* the point of the OtherAction action is for TypeScript to warn us if we don't
* have a default case when processing actions. We will never dispatch
* OtherAction, but we do need a default case for the other Actions that are
* dispatched (by third-party plugins and Redux itself). For more information,
* see https://spin.atomicobject.com/2017/07/24/redux-action-pattern-typescript/
*/

export interface OtherAction {
  type: MatchesActionType.OTHER_ACTION
}

export type MatchesAction = CreateMatchAction
| DismissMatchPopupAction
| AttemptSendMessagesAction
| SendMessagesSuccessAction
| SendMessagesFailureAction
| ReceiveMessagesAction
| SetConversationAsReadAction
| ClearMatchesStateAction
| UnmatchAction
| RemoveChatAction
| RehydrateMatchesFromServerAction
| RehydrateAction
| OtherAction

/* Action Creators */

export const rehydrateMatchesFromServer = (matches: NewMatch[]): RehydrateMatchesFromServerAction => {
  return {
    type: MatchesActionType.REHYDRATE_MATCHES_FROM_SERVER,
    matches,
  }
}

export const createMatch = (id: number,
                            conversationId: string,
                            createdAt: string,
                            otherUsers: number[],
                            shouldShowMatchPopup: boolean): CreateMatchAction => {
  return {
    type: MatchesActionType.CREATE_MATCH,
    id,
    createdAt,
    conversationId,
    otherUsers,
    shouldShowMatchPopup,
  }
}

export const dismissMatchPopup = (): DismissMatchPopupAction => {
  return {
    type: MatchesActionType.DISMISS_MATCH_POPUP,
  }
}

export const unmatch = (matchId: number, conversationId: string): UnmatchAction => {
  return {
    type: MatchesActionType.UNMATCH,
    conversationId,
    matchId,
  }
}

export const removeChat = (conversationId: string): RemoveChatAction => {
  return {
    type: MatchesActionType.REMOVE_CHAT,
    conversationId,
  }
}

export const sendMessages = (conversationId: string, messages: ChatMessage[]): AttemptSendMessagesAction => {
  return {
    type: MatchesActionType.ATTEMPT_SEND_MESSAGES,
    conversationId,
    messages,
  }
}

export const receiveMessages = (conversationId: string, messages: ChatMessage[]): ReceiveMessagesAction => {
  return {
    type: MatchesActionType.RECEIVE_MESSAGES,
    conversationId,
    messages,
  }
}

export const setConversationAsRead = (conversationId: string): SetConversationAsReadAction => {
  return {
    type: MatchesActionType.SET_CONVERSATION_AS_READ,
    conversationId,
  }
}

export const clearMatchesState = (): ClearMatchesStateAction => {
  return {
    type: MatchesActionType.CLEAR_MATCHES_STATE,
  }
}
