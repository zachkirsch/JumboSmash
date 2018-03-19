import { RootState } from '../../redux'
import { GiftedChatMessage } from './types'

/* Actions */

export enum MatchesActionType {
  ATTEMPT_SEND_MESSAGES = 'ATTEMPT_SEND_MESSAGES',
  SEND_MESSAGES_SUCCESS = 'SEND_MESSAGES_SUCCESS',
  SEND_MESSAGES_FAILURE = 'SEND_MESSAGES_FAILURE',
  RECEIVE_MESSAGES = 'RECEIVE_MESSAGES',
  REHYDRATE = 'persist/REHYDRATE',
  OTHER_ACTION = '__any_other_action_type__',
}

export interface AttemptSendMessagesAction {
  type: MatchesActionType.ATTEMPT_SEND_MESSAGES
  conversationId: string
  messages: GiftedChatMessage[]
}

export interface SendMessagesSuccessAction {
  type: MatchesActionType.SEND_MESSAGES_SUCCESS
  conversationId: string
  messages: GiftedChatMessage[]
}

export interface SendMessagesFailureAction {
  type: MatchesActionType.SEND_MESSAGES_FAILURE
  conversationId: string
  messages: GiftedChatMessage[]
  errorMessage: string
}

export interface ReceiveMessagesAction {
  type: MatchesActionType.RECEIVE_MESSAGES
  conversationId: string
  messages: GiftedChatMessage[]
}

// this is a separate case because redux-persist stores immutables as plain JS
export interface RehydrateAction {
  type: MatchesActionType.REHYDRATE
  payload: RootState
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

export type MatchesAction =
AttemptSendMessagesAction
| SendMessagesSuccessAction
| SendMessagesFailureAction
| ReceiveMessagesAction
| RehydrateAction
| OtherAction

/* Action Creators */

export const sendMessages = (conversationId: string, messages: GiftedChatMessage[]): AttemptSendMessagesAction => {
  return {
    type: MatchesActionType.ATTEMPT_SEND_MESSAGES,
    conversationId,
    messages,
  }
}

export const receiveMessages = (conversationId: string, messages: GiftedChatMessage[]): ReceiveMessagesAction => {
  return {
    type: MatchesActionType.RECEIVE_MESSAGES,
    conversationId,
    messages,
  }
}
