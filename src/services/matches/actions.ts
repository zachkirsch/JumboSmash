import { RootState } from '../../redux'
import { User, GiftedChatMessage } from './types'
import { Direction } from '../api'

/* Actions */

export enum MatchesActionType {
  ATTEMPT_FETCH_ALL_USERS = 'ATTEMPT_FETCH_ALL_USERS',
  FETCH_ALL_USERS_SUCCESS = 'FETCH_ALL_USERS_SUCCESS',
  FETCH_ALL_USERS_FAILURE = 'FETCH_ALL_USERS_FAILURE',

  ATTEMPT_SWIPE = 'ATTEMPT_SWIPE',
  SWIPE_SUCCESS = 'SWIPE_SUCCESS',
  SWIPE_FAILURE = 'SWIPE_FAILURE',
  CREATE_MATCH = 'CREATE_MATCH',

  ATTEMPT_SEND_MESSAGES = 'ATTEMPT_SEND_MESSAGES',
  SEND_MESSAGES_SUCCESS = 'SEND_MESSAGES_SUCCESS',
  SEND_MESSAGES_FAILURE = 'SEND_MESSAGES_FAILURE',
  RECEIVE_MESSAGES = 'RECEIVE_MESSAGES',

  REHYDRATE = 'persist/REHYDRATE',
  OTHER_ACTION = '__any_other_action_type__',
}

export interface AttemptFetchAllUsersAction {
  type: MatchesActionType.ATTEMPT_FETCH_ALL_USERS
}

export interface FetchAllUsersSuccessAction {
  type: MatchesActionType.FETCH_ALL_USERS_SUCCESS
  users: User[]
}

export interface FetchAllUsersFailureAction {
  type: MatchesActionType.FETCH_ALL_USERS_FAILURE
  errorMessage: string
}

export interface AttemptSwipeAction {
  type: MatchesActionType.ATTEMPT_SWIPE
  direction: Direction
  onUser: User
}

export interface SwipeSuccessAction {
  type: MatchesActionType.ATTEMPT_SWIPE
  direction: Direction
  onUser: User
}

export interface SwipeFailureAction {
  type: MatchesActionType.SWIPE_FAILURE
  direction: Direction
  onUser: User
  errorMessage: string
}

export interface CreateMatchAction {
  type: MatchesActionType.CREATE_MATCH
  conversationId: string
  onUser: User
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

export type MatchesAction = AttemptFetchAllUsersAction
| FetchAllUsersSuccessAction
| FetchAllUsersFailureAction
| AttemptSwipeAction
| SwipeSuccessAction
| SwipeFailureAction
| CreateMatchAction
| AttemptSendMessagesAction
| SendMessagesSuccessAction
| SendMessagesFailureAction
| ReceiveMessagesAction
| RehydrateAction
| OtherAction

/* Action Creators */

export const fetchAllUsers = (): AttemptFetchAllUsersAction => {
  return {
    type: MatchesActionType.ATTEMPT_FETCH_ALL_USERS,
  }
}

export const swipe = (direction: Direction, onUser: User): AttemptSwipeAction => {
  return {
    type: MatchesActionType.ATTEMPT_SWIPE,
    direction,
    onUser,
  }
}

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
