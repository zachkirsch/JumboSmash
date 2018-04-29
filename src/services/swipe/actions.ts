import { Direction } from '../api'
import { User } from './types'
import { RehydrateAction } from '../redux'
import { ProfileReact } from '../profile'

/* Actions */

export enum SwipeActionType {
  ATTEMPT_FETCH_ALL_USERS = 'ATTEMPT_FETCH_ALL_USERS',
  FETCH_ALL_USERS_SUCCESS = 'FETCH_ALL_USERS_SUCCESS',
  FETCH_ALL_USERS_FAILURE = 'FETCH_ALL_USERS_FAILURE',

  ATTEMPT_FETCH_SWIPABLE_USERS = 'ATTEMPT_FETCH_SWIPABLE_USERS',
  FETCH_SWIPABLE_USERS_SUCCESS = 'FETCH_SWIPABLE_USERS_SUCCESS',
  FETCH_SWIPABLE_USERS_FAILURE = 'FETCH_SWIPABLE_USERS_FAILURE',

  ATTEMPT_SWIPE = 'ATTEMPT_SWIPE',
  SWIPE_SUCCESS = 'SWIPE_SUCCESS',
  SWIPE_FAILURE = 'SWIPE_FAILURE',

  ATTEMPT_REACT = 'ATTEMPT_REACT',
  REACT_SUCCESS = 'REACT_SUCCESS',
  REACT_FAILURE = 'REACT_FAILURE',

  CLEAR_SWIPE_STATE = 'CLEAR_SWIPE_STATE',

  OTHER_ACTION = '__any_other_action_type__',
}

export interface AttemptFetchAllUsersAction {
  type: SwipeActionType.ATTEMPT_FETCH_ALL_USERS
}

export interface FetchAllUsersSuccessAction {
  type: SwipeActionType.FETCH_ALL_USERS_SUCCESS
  users: User[]
}

export interface FetchAllUsersFailureAction {
  type: SwipeActionType.FETCH_ALL_USERS_FAILURE
  errorMessage: string
}

export interface AttemptFetchSwipableUsersAction {
  type: SwipeActionType.ATTEMPT_FETCH_SWIPABLE_USERS
}

export interface FetchSwipableUsersSuccessAction {
  type: SwipeActionType.FETCH_SWIPABLE_USERS_SUCCESS
  allUsers: User[]
  swipableUsers: number[]
}

export interface FetchSwipableUsersFailureAction {
  type: SwipeActionType.FETCH_SWIPABLE_USERS_FAILURE
  errorMessage: string
}

export interface AttemptSwipeAction {
  type: SwipeActionType.ATTEMPT_SWIPE
  direction: Direction
  onUser: User
}

export interface SwipeSuccessAction {
  type: SwipeActionType.SWIPE_SUCCESS
  direction: Direction
  onUser: User
}

export interface SwipeFailureAction {
  type: SwipeActionType.SWIPE_FAILURE
  direction: Direction
  onUser: User
  errorMessage: string
}

export interface AttemptReactAction {
  type: SwipeActionType.ATTEMPT_REACT
  reacts: ProfileReact[]
  onUser: User
}

export interface ReactSuccessAction {
  type: SwipeActionType.REACT_SUCCESS
  onUser: User
}

export interface ReactFailureAction {
  type: SwipeActionType.REACT_FAILURE
  onUser: User
  errorMessage: string
}

export interface ClearSwipeStateAction {
  type: SwipeActionType.CLEAR_SWIPE_STATE
}

/* the point of the OtherAction action is for TypeScript to warn us if we don't
* have a default case when processing actions. We will never dispatch
* OtherAction, but we do need a default case for the other Actions that are
* dispatched (by third-party plugins and Redux itself). For more information,
* see https://spin.atomicobject.com/2017/07/24/redux-action-pattern-typescript/
*/

export interface OtherAction {
  type: SwipeActionType.OTHER_ACTION
}

export type SwipeAction = AttemptFetchAllUsersAction
| FetchAllUsersSuccessAction
| FetchAllUsersFailureAction
| AttemptFetchSwipableUsersAction
| FetchSwipableUsersSuccessAction
| FetchSwipableUsersFailureAction
| AttemptSwipeAction
| SwipeSuccessAction
| SwipeFailureAction
| AttemptReactAction
| ReactSuccessAction
| ReactFailureAction
| ClearSwipeStateAction
| RehydrateAction
| OtherAction

/* Action Creators */

export const fetchAllUsers = (): AttemptFetchAllUsersAction => {
  return {
    type: SwipeActionType.ATTEMPT_FETCH_ALL_USERS,
  }
}

export const fetchSwipableUsers = (): AttemptFetchSwipableUsersAction => {
  return {
    type: SwipeActionType.ATTEMPT_FETCH_SWIPABLE_USERS,
  }
}

export const swipe = (direction: Direction, onUser: User): AttemptSwipeAction => {
  return {
    type: SwipeActionType.ATTEMPT_SWIPE,
    direction,
    onUser,
  }
}

export const react = (reacts: ProfileReact[], onUser: User): AttemptReactAction => {
  return {
    type: SwipeActionType.ATTEMPT_REACT,
    onUser,
    reacts,
  }
}

export const clearSwipeState = (): ClearSwipeStateAction => {
  return {
    type: SwipeActionType.CLEAR_SWIPE_STATE,
  }
}
