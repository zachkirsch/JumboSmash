import { TagSectionType, Event, BucketListCategory } from './types'
import { RehydrateAction } from '../redux'
import {
  GetTagsResponse,
  GetReactsResponse,
  GetEventsResponse,
  GetBucketListResponse,
  MeResponse,
  ProfileReact,
  IndividualProfileReact,
} from '../api'
import { VerifyEmailSuccessAction } from '../auth'

/* Actions */
export enum ProfileActionType {

  ATTEMPT_REHYDRATE_PROFILE_FROM_SERVER = 'ATTEMPT_REHYDRATE_PROFILE_FROM_SERVER',
  INITIALIZE_PROFILE = 'INITIALIZE_PROFILE',

  ATTEMPT_UPDATE_PREFERRED_NAME = 'ATTEMPT_UPDATE_PREFERRED_NAME',
  UPDATE_PREFERRED_NAME_SUCCESS = 'UPDATE_PREFERRED_NAME_SUCCESS',
  UPDATE_PREFERRED_NAME_FAILURE = 'UPDATE_PREFERRED_NAME_FAILURE',

  ATTEMPT_UPDATE_BIO = 'ATTEMPT_UPDATE_BIO',
  UPDATE_BIO_SUCCESS = 'UPDATE_BIO_SUCCESS',
  UPDATE_BIO_FAILURE = 'UPDATE_BIO_FAILURE',

  ATTEMPT_UPDATE_SENIOR_GOAL = 'ATTEMPT_UPDATE_SENIOR_GOAL',
  UPDATE_SENIOR_GOAL_SUCCESS = 'UPDATE_SENIOR_GOAL_SUCCESS',
  UPDATE_SENIOR_GOAL_FAILURE = 'UPDATE_SENIOR_GOAL_FAILURE',

  ATTEMPT_UPDATE_IMAGE = 'ATTEMPT_UPDATE_IMAGE',
  UPDATE_IMAGE_SUCCESS = 'UPDATE_IMAGE_SUCCESS',
  UPDATE_IMAGE_FAILURE = 'UPDATE_IMAGE_FAILURE',
  SWAP_IMAGES = 'SWAP_IMAGES',

  ATTEMPT_UPDATE_TAGS = 'ATTEMPT_UPDATE_TAGS',
  UPDATE_TAGS_SUCCESS = 'UPDATE_TAGS_SUCCESS',
  UPDATE_TAGS_FAILURE = 'UPDATE_TAGS_FAILURE',

  ATTEMPT_UPDATE_EVENTS = 'ATTEMPT_UPDATE_EVENTS',
  UPDATE_EVENTS_SUCCESS = 'UPDATE_EVENTS_SUCCESS',
  UPDATE_EVENTS_FAILURE = 'UPDATE_EVENTS_FAILURE',

  ATTEMPT_UPDATE_BUCKET_LIST = 'ATTEMPT_UPDATE_BUCKET_LIST',
  UPDATE_BUCKET_LIST_SUCCESS = 'UPDATE_BUCKET_LIST_SUCCESS',
  UPDATE_BUCKET_LIST_FAILURE = 'UPDATE_BUCKET_LIST_FAILURE',

  ATTEMPT_BLOCK_USER = 'ATTEMPT_BLOCK_USER',
  BLOCK_USER_SUCCESS = 'BLOCK_USER_SUCCESS',
  BLOCK_USER_FAILURE = 'BLOCK_USER_FAILURE',

  ATTEMPT_UNBLOCK_USER = 'ATTEMPT_UNBLOCK_USER',
  UNBLOCK_USER_SUCCESS = 'UNBLOCK_USER_SUCCESS',
  UNBLOCK_USER_FAILURE = 'UNBLOCK_USER_FAILURE',

  UPDATE_PROFILE_REACTS = 'UPDATE_PROFILE_REACTS',

  ATTEMPT_TOGGLE_UNDERCLASSMEN = 'ATTEMPT_TOGGLE_UNDERCLASSMEN',
  TOGGLE_UNDERCLASSMEN_SUCCESS = 'TOGGLE_UNDERCLASSMEN_SUCCESS',
  TOGGLE_UNDERCLASSMEN_FAILURE = 'TOGGLE_UNDERCLASSMEN_FAILURE',

  CLEAR_PROFILE_STATE = 'CLEAR_PROFILE_STATE',

  OTHER_ACTION = '__any_other_action_type__',
}

export interface AttemptRehydrateProfileFromServerAction {
  type: ProfileActionType.ATTEMPT_REHYDRATE_PROFILE_FROM_SERVER
}

export interface InitializeProfileAction {
  type: ProfileActionType.INITIALIZE_PROFILE
  allTags: GetTagsResponse
  allReacts: GetReactsResponse
  allEvents: GetEventsResponse
  allBucketListItems: GetBucketListResponse
  payload: MeResponse
}

export interface AttemptUpdatePreferredNameAction {
  type: ProfileActionType.ATTEMPT_UPDATE_PREFERRED_NAME
  preferredName: string
}

export interface UpdatePreferredNameSuccessAction {
  type: ProfileActionType.UPDATE_PREFERRED_NAME_SUCCESS
}

export interface UpdatePreferredNameFailureAction {
  type: ProfileActionType.UPDATE_PREFERRED_NAME_FAILURE
  errorMessage: string
}

export interface AttemptUpdateBioAction {
  type: ProfileActionType.ATTEMPT_UPDATE_BIO
  bio: string
}

export interface UpdateBioSuccessAction {
  type: ProfileActionType.UPDATE_BIO_SUCCESS
}

export interface UpdateBioFailureAction {
  type: ProfileActionType.UPDATE_BIO_FAILURE
  errorMessage: string
}

export interface AttemptUpdateSeniorGoalAction {
  type: ProfileActionType.ATTEMPT_UPDATE_SENIOR_GOAL
  seniorGoal: string
}

export interface UpdateSeniorGoalSuccessAction {
  type: ProfileActionType.UPDATE_SENIOR_GOAL_SUCCESS
}

export interface UpdateSeniorGoalFailureAction {
  type: ProfileActionType.UPDATE_SENIOR_GOAL_FAILURE
  errorMessage: string
}

export interface AttemptUpdateImageAction {
  type: ProfileActionType.ATTEMPT_UPDATE_IMAGE
  index: number
  imageUri: string
  mime: string
}

export interface UpdateImageSuccessAction {
  type: ProfileActionType.UPDATE_IMAGE_SUCCESS
  index: number
  localUri: string
  remoteUri: string
}

export interface UpdateImageFailureAction {
  type: ProfileActionType.UPDATE_IMAGE_FAILURE
  index: number
  localUri: string
  errorMessage: string
}

export interface SwapImagesAction {
  type: ProfileActionType.SWAP_IMAGES
  index1: number
  index2: number
}

export interface AttemptUpdateEventsAction {
  type: ProfileActionType.ATTEMPT_UPDATE_EVENTS
  events: Event[]
}

export interface UpdateEventsSuccessAction {
  type: ProfileActionType.UPDATE_EVENTS_SUCCESS
}

export interface UpdateEventsFailureAction {
  type: ProfileActionType.UPDATE_EVENTS_FAILURE
  errorMessage: string
}

export interface AttemptUpdateBucketListAction {
  type: ProfileActionType.ATTEMPT_UPDATE_BUCKET_LIST
  items: BucketListCategory[]
}

export interface UpdateBucketListSuccessAction {
  type: ProfileActionType.UPDATE_BUCKET_LIST_SUCCESS
}

export interface UpdateBucketListFailureAction {
  type: ProfileActionType.UPDATE_BUCKET_LIST_FAILURE
  errorMessage: string
}

export interface AttemptUpdateTagsAction {
  type: ProfileActionType.ATTEMPT_UPDATE_TAGS
  tags: TagSectionType[]
}

export interface UpdateTagsSuccessAction {
  type: ProfileActionType.UPDATE_TAGS_SUCCESS
}

export interface UpdateTagsFailureAction {
  type: ProfileActionType.UPDATE_TAGS_FAILURE
  errorMessage: string
}

export interface AttemptBlockUserAction {
  type: ProfileActionType.ATTEMPT_BLOCK_USER
  email: string
  userId?: number
}

export interface BlockUserSuccessAction {
  type: ProfileActionType.BLOCK_USER_SUCCESS
  email: string
}

export interface BlockUserFailureAction {
  type: ProfileActionType.BLOCK_USER_FAILURE
  email: string
  errorMessage: string
}

export interface AttemptUnblockUserAction {
  type: ProfileActionType.ATTEMPT_UNBLOCK_USER
  email: string
}

export interface UnblockUserSuccessAction {
  type: ProfileActionType.UNBLOCK_USER_SUCCESS
  email: string
}

export interface UnblockUserFailureAction {
  type: ProfileActionType.UNBLOCK_USER_FAILURE
  email: string
  errorMessage: string
}

export interface UpdateProfileReactsAction {
  type: ProfileActionType.UPDATE_PROFILE_REACTS
  profileReacts: ProfileReact[]
  whoReacted: IndividualProfileReact[]
}

export interface AttemptToggleUnderclassmenAction {
  type: ProfileActionType.ATTEMPT_TOGGLE_UNDERCLASSMEN
  showUnderclassmen: boolean
}

export interface ToggleUnderclassmenSuccessAction {
  type: ProfileActionType.TOGGLE_UNDERCLASSMEN_SUCCESS
}

export interface ToggleUnderclassmenFailureAction {
  type: ProfileActionType.TOGGLE_UNDERCLASSMEN_FAILURE
  errorMessage: string
}

export interface ClearProfileStateAction {
  type: ProfileActionType.CLEAR_PROFILE_STATE
}

/* the point of the OtherAction action is for TypeScript to warn us if we don't
 * have a default case when processing actions. We will never dispatch
 * OtherAction, but we do need a default case for the other Actions that are
 * dispatched (by third-party plugins and Redux itself). For more information,
 * see https://spin.atomicobject.com/2017/07/24/redux-action-pattern-typescript/
 */

export interface OtherAction {
  type: ProfileActionType.OTHER_ACTION
}

export type ProfileAction = AttemptRehydrateProfileFromServerAction
| InitializeProfileAction
| AttemptUpdatePreferredNameAction
| UpdatePreferredNameSuccessAction
| UpdatePreferredNameFailureAction
| AttemptUpdateBioAction
| UpdateBioSuccessAction
| UpdateBioFailureAction
| AttemptUpdateSeniorGoalAction
| UpdateSeniorGoalSuccessAction
| UpdateSeniorGoalFailureAction
| AttemptUpdateImageAction
| UpdateImageSuccessAction
| UpdateImageFailureAction
| SwapImagesAction
| AttemptUpdateEventsAction
| UpdateEventsSuccessAction
| UpdateEventsFailureAction
| AttemptUpdateBucketListAction
| UpdateBucketListSuccessAction
| UpdateBucketListFailureAction
| AttemptUpdateTagsAction
| UpdateTagsSuccessAction
| UpdateTagsFailureAction
| AttemptBlockUserAction
| BlockUserSuccessAction
| BlockUserFailureAction
| AttemptUnblockUserAction
| UnblockUserSuccessAction
| UnblockUserFailureAction
| UpdateProfileReactsAction
| AttemptToggleUnderclassmenAction
| ToggleUnderclassmenSuccessAction
| ToggleUnderclassmenFailureAction
| ClearProfileStateAction
| VerifyEmailSuccessAction
| RehydrateAction
| OtherAction

/* Action Creators */

export const rehydrateProfileFromServer = (): AttemptRehydrateProfileFromServerAction => {
  return {
    type: ProfileActionType.ATTEMPT_REHYDRATE_PROFILE_FROM_SERVER,
  }
}

export const initializeProfile = (allTags: GetTagsResponse,
                                  allReacts: GetReactsResponse,
                                  allEvents: GetEventsResponse,
                                  allBucketListItems: GetBucketListResponse,
                                  payload: MeResponse): InitializeProfileAction => {
  return {
    type: ProfileActionType.INITIALIZE_PROFILE,
    allTags,
    allReacts,
    allEvents,
    allBucketListItems,
    payload,
  }
}

export const updatePreferredName = (preferredName: string): AttemptUpdatePreferredNameAction => {
  return {
    type: ProfileActionType.ATTEMPT_UPDATE_PREFERRED_NAME,
    preferredName,
  }
}

export const updateBio = (bio: string): AttemptUpdateBioAction => {
  return {
    type: ProfileActionType.ATTEMPT_UPDATE_BIO,
    bio,
  }
}

export const updateSeniorGoal = (seniorGoal: string): AttemptUpdateSeniorGoalAction => {
  return {
    type: ProfileActionType.ATTEMPT_UPDATE_SENIOR_GOAL,
    seniorGoal,
  }
}

export const updateImage = (index: number, imageUri: string, mime: string): AttemptUpdateImageAction => {
  return {
    type: ProfileActionType.ATTEMPT_UPDATE_IMAGE,
    imageUri,
    mime,
    index,
  }
}

export const swapImages = (index1: number, index2: number): SwapImagesAction => {
  return {
    type: ProfileActionType.SWAP_IMAGES,
    index1,
    index2,
  }
}

export const updateTags = (tags: TagSectionType[]): AttemptUpdateTagsAction => {
  return {
    type: ProfileActionType.ATTEMPT_UPDATE_TAGS,
    tags,
  }
}

export const updateBucketList = (items: BucketListCategory[]): AttemptUpdateBucketListAction => {
  return {
    type: ProfileActionType.ATTEMPT_UPDATE_BUCKET_LIST,
    items,
  }
}

export const updateEvents = (events: Event[]): AttemptUpdateEventsAction => {
  return {
    type: ProfileActionType.ATTEMPT_UPDATE_EVENTS,
    events,
  }
}

export const blockUser = (email: string, userId?: number): AttemptBlockUserAction => {
  return {
    type: ProfileActionType.ATTEMPT_BLOCK_USER,
    email,
    userId,
  }
}

export const unblockUser = (email: string): AttemptUnblockUserAction => {
  return {
    type: ProfileActionType.ATTEMPT_UNBLOCK_USER,
    email,
  }
}

export const updateProfileReacts = (profileReacts: ProfileReact[],
                                    whoReacted: IndividualProfileReact[]): UpdateProfileReactsAction => {
  return {
    type: ProfileActionType.UPDATE_PROFILE_REACTS,
    profileReacts,
    whoReacted,
  }
}

export const toggleUnderclassmen = (showUnderclassmen: boolean): AttemptToggleUnderclassmenAction => {
  return {
    type: ProfileActionType.ATTEMPT_TOGGLE_UNDERCLASSMEN,
    showUnderclassmen,
  }
}

export const clearProfileState = (): ClearProfileStateAction => {
  return {
    type: ProfileActionType.CLEAR_PROFILE_STATE,
  }
}
