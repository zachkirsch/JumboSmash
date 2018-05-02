import { IChatMessage } from 'react-native-gifted-chat'
import { RehydrateAction } from '../redux'
import { GetUserResponse } from '../api'
import { NewMatch } from './types'

/* Actions */

export enum MatchesActionType {
  CREATE_MATCH = 'CREATE_MATCH',

  ATTEMPT_SEND_MESSAGES = 'ATTEMPT_SEND_MESSAGES',
  SEND_MESSAGES_SUCCESS = 'SEND_MESSAGES_SUCCESS',
  SEND_MESSAGES_FAILURE = 'SEND_MESSAGES_FAILURE',
  RECEIVE_MESSAGES = 'RECEIVE_MESSAGES',
  SET_CONVERSATION_AS_READ = 'SET_CONVERSATION_AS_READ',

  REHYDRATE_MATCHES_FROM_SERVER = 'REHYDRATE_MATCHES_FROM_SERVER',
  UNMATCH = 'UNMATCH',

  CLEAR_MATCHES_STATE = 'CLEAR_MATCHES_STATE',
  OTHER_ACTION = '__any_other_action_type__',
}

export interface CreateMatchAction extends NewMatch {
  type: MatchesActionType.CREATE_MATCH
  openChatAfterCreation?: boolean
}

export interface AttemptSendMessagesAction {
  type: MatchesActionType.ATTEMPT_SEND_MESSAGES
  conversationId: string
  messages: IChatMessage[]
}

export interface SendMessagesSuccessAction {
  type: MatchesActionType.SEND_MESSAGES_SUCCESS
  conversationId: string
  messages: IChatMessage[]
}

export interface SendMessagesFailureAction {
  type: MatchesActionType.SEND_MESSAGES_FAILURE
  conversationId: string
  messages: IChatMessage[]
  errorMessage: string
}

export interface ReceiveMessagesAction {
  type: MatchesActionType.RECEIVE_MESSAGES
  conversationId: string
  messages: IChatMessage[]
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
| AttemptSendMessagesAction
| SendMessagesSuccessAction
| SendMessagesFailureAction
| ReceiveMessagesAction
| SetConversationAsReadAction
| ClearMatchesStateAction
| UnmatchAction
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
                            createdAt: number,
                            otherUsers: GetUserResponse[],
                            openChatAfterCreation?: boolean): CreateMatchAction => {
  return {
    type: MatchesActionType.CREATE_MATCH,
    id,
    createdAt,
    conversationId,
    otherUsers,
    openChatAfterCreation,
  }
}

export const unmatch = (matchId: number, conversationId: string): UnmatchAction => {
  return {
    type: MatchesActionType.UNMATCH,
    conversationId,
    matchId,
  }
}

export const sendMessages = (conversationId: string, messages: IChatMessage[]): AttemptSendMessagesAction => {
  return {
    type: MatchesActionType.ATTEMPT_SEND_MESSAGES,
    conversationId,
    messages,
  }
}

export const receiveMessages = (conversationId: string, messages: IChatMessage[]): ReceiveMessagesAction => {
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
