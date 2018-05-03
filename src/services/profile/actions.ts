import { TagSectionType } from './types'
import { RehydrateAction } from '../redux'
import { GetTagsResponse, GetReactsResponse, MeResponse, ProfileReact } from '../api'
import { VerifyEmailSuccessAction } from '../auth'

/* Actions */
export enum ProfileActionType {

  INITIALIZE_PROFILE = 'INITIALIZE_PROFILE',

  ON_CHANGE_PREFERRED_NAME_TEXTINPUT = 'ON_CHANGE_PREFERRED_NAME_TEXTINPUT',
  UPDATE_PREFERRED_NAME_LOCALLY = 'UPDATE_PREFERRED_NAME_LOCALLY',
  ATTEMPT_UPDATE_PREFERRED_NAME = 'ATTEMPT_UPDATE_PREFERRED_NAME',
  UPDATE_PREFERRED_NAME_SUCCESS = 'UPDATE_PREFERRED_NAME_SUCCESS',
  UPDATE_PREFERRED_NAME_FAILURE = 'UPDATE_PREFERRED_NAME_FAILURE',

  ON_CHANGE_MAJOR_TEXTINPUT = 'ON_CHANGE_MAJOR_TEXTINPUT',
  UPDATE_MAJOR_LOCALLY = 'UPDATE_MAJOR_LOCALLY',
  ATTEMPT_UPDATE_MAJOR = 'ATTEMPT_UPDATE_MAJOR',
  UPDATE_MAJOR_SUCCESS = 'UPDATE_MAJOR_SUCCESS',
  UPDATE_MAJOR_FAILURE = 'UPDATE_MAJOR_FAILURE',

  ON_CHANGE_BIO_TEXTINPUT = 'ON_CHANGE_BIO_TEXTINPUT',
  UPDATE_BIO_LOCALLY = 'UPDATE_BIO_LOCALLY',
  ATTEMPT_UPDATE_BIO = 'ATTEMPT_UPDATE_BIO',
  UPDATE_BIO_SUCCESS = 'UPDATE_BIO_SUCCESS',
  UPDATE_BIO_FAILURE = 'UPDATE_BIO_FAILURE',

  ATTEMPT_UPDATE_IMAGE = 'ATTEMPT_UPDATE_IMAGE',
  UPDATE_IMAGE_SUCCESS = 'UPDATE_IMAGE_SUCCESS',
  UPDATE_IMAGE_FAILURE = 'UPDATE_IMAGE_FAILURE',
  SWAP_IMAGES = 'SWAP_IMAGES',

  UPDATE_TAGS_LOCALLY = 'UPDATE_TAGS_LOCALLY',
  ATTEMPT_UPDATE_TAGS = 'ATTEMPT_UPDATE_TAGS',
  UPDATE_TAGS_SUCCESS = 'UPDATE_TAGS_SUCCESS',
  UPDATE_TAGS_FAILURE = 'UPDATE_TAGS_FAILURE',

  ATTEMPT_BLOCK_USER = 'ATTEMPT_BLOCK_USER',
  BLOCK_USER_SUCCESS = 'BLOCK_USER_SUCCESS',
  BLOCK_USER_FAILURE = 'BLOCK_USER_FAILURE',

  ATTEMPT_UNBLOCK_USER = 'ATTEMPT_UNBLOCK_USER',
  UNBLOCK_USER_SUCCESS = 'UNBLOCK_USER_SUCCESS',
  UNBLOCK_USER_FAILURE = 'UNBLOCK_USER_FAILURE',

  UPDATE_PROFILE_REACTS = 'UPDATE_PROFILE_REACTS',

  TOGGLE_UNDERCLASSMEN = 'TOGGLE_UNDERCLASSMEN',

  CLEAR_PROFILE_STATE = 'CLEAR_PROFILE_STATE',

  OTHER_ACTION = '__any_other_action_type__',
}

export interface InitializeProfileAction {
  type: ProfileActionType.INITIALIZE_PROFILE
  allTags: GetTagsResponse
  allReacts: GetReactsResponse
  payload: MeResponse
}

export interface OnChangePreferredNameTextInputAction {
  type: ProfileActionType.ON_CHANGE_PREFERRED_NAME_TEXTINPUT,
  preferredName: string,
}

export interface UpdatePreferredNameLocallyAction {
  type: ProfileActionType.UPDATE_PREFERRED_NAME_LOCALLY
  preferredName: string
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

export interface OnChangeMajorTextInputAction {
  type: ProfileActionType.ON_CHANGE_MAJOR_TEXTINPUT,
  major: string,
}

export interface UpdateMajorLocallyAction {
  type: ProfileActionType.UPDATE_MAJOR_LOCALLY
  major: string
}

export interface AttemptUpdateMajorAction {
  type: ProfileActionType.ATTEMPT_UPDATE_MAJOR
  major: string
}

export interface UpdateMajorSuccessAction {
  type: ProfileActionType.UPDATE_MAJOR_SUCCESS
}

export interface UpdateMajorFailureAction {
  type: ProfileActionType.UPDATE_MAJOR_FAILURE
  errorMessage: string
}

export interface OnChangeBioTextInputAction {
  type: ProfileActionType.ON_CHANGE_BIO_TEXTINPUT,
  bio: string,
}

export interface UpdateBioLocallyAction {
  type: ProfileActionType.UPDATE_BIO_LOCALLY
  bio: string
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

export interface UpdateTagsLocallyAction {
  type: ProfileActionType.UPDATE_TAGS_LOCALLY
  tags: TagSectionType[] | undefined
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
}

export interface ToggleUnderclassmenAction {
  type: ProfileActionType.TOGGLE_UNDERCLASSMEN
  showUnderclassmen: boolean
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

export type ProfileAction = InitializeProfileAction
| OnChangePreferredNameTextInputAction
| UpdatePreferredNameLocallyAction
| AttemptUpdatePreferredNameAction
| UpdatePreferredNameSuccessAction
| UpdatePreferredNameFailureAction
| OnChangeMajorTextInputAction
| UpdateMajorLocallyAction
| AttemptUpdateMajorAction
| UpdateMajorSuccessAction
| UpdateMajorFailureAction
| OnChangeBioTextInputAction
| UpdateBioLocallyAction
| AttemptUpdateBioAction
| UpdateBioSuccessAction
| UpdateBioFailureAction
| AttemptUpdateImageAction
| UpdateImageSuccessAction
| UpdateImageFailureAction
| SwapImagesAction
| UpdateTagsLocallyAction
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
| ToggleUnderclassmenAction
| ClearProfileStateAction
| VerifyEmailSuccessAction
| RehydrateAction
| OtherAction

/* Action Creators */

export const initializeProfile = (allTags: GetTagsResponse, allReacts: GetReactsResponse, payload: MeResponse): InitializeProfileAction => {
  return {
    type: ProfileActionType.INITIALIZE_PROFILE,
    allTags,
    allReacts,
    payload,
  }
}

export const onChangePreferredNameTextInput = (preferredName: string): OnChangePreferredNameTextInputAction => {
  return {
    type: ProfileActionType.ON_CHANGE_PREFERRED_NAME_TEXTINPUT,
    preferredName,
  }
}

export const updatePreferredName = (preferredName: string): AttemptUpdatePreferredNameAction => {
  return {
    type: ProfileActionType.ATTEMPT_UPDATE_PREFERRED_NAME,
    preferredName,
  }
}

export const onChangeMajorTextInput = (major: string): OnChangeMajorTextInputAction => {
  return {
    type: ProfileActionType.ON_CHANGE_MAJOR_TEXTINPUT,
    major,
  }
}

export const updateMajor = (major: string): AttemptUpdateMajorAction => {
  return {
    type: ProfileActionType.ATTEMPT_UPDATE_MAJOR,
    major,
  }
}

export const onChangeBioTextInput = (bio: string): OnChangeBioTextInputAction => {
  return {
    type: ProfileActionType.ON_CHANGE_BIO_TEXTINPUT,
    bio,
  }
}

export const updateBio = (bio: string): AttemptUpdateBioAction => {
  return {
    type: ProfileActionType.ATTEMPT_UPDATE_BIO,
    bio,
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

export const updateTagsLocally = (tags: TagSectionType[] | undefined): UpdateTagsLocallyAction => {
  return {
    type: ProfileActionType.UPDATE_TAGS_LOCALLY,
    tags,
  }
}

export const updateTags = (tags: TagSectionType[]): AttemptUpdateTagsAction => {
  return {
    type: ProfileActionType.ATTEMPT_UPDATE_TAGS,
    tags,
  }
}

export const blockUser = (email: string): AttemptBlockUserAction => {
  return {
    type: ProfileActionType.ATTEMPT_BLOCK_USER,
    email,
  }
}

export const unblockUser = (email: string): AttemptUnblockUserAction => {
  return {
    type: ProfileActionType.ATTEMPT_UNBLOCK_USER,
    email,
  }
}

export const updateProfileReacts = (profileReacts: ProfileReact[]): UpdateProfileReactsAction => {
  return {
    type: ProfileActionType.UPDATE_PROFILE_REACTS,
    profileReacts,
  }
}

export const toggleUnderclassmen = (showUnderclassmen: boolean): ToggleUnderclassmenAction => {
  return {
    type: ProfileActionType.TOGGLE_UNDERCLASSMEN,
    showUnderclassmen,
  }
}

export const clearProfileState = (): ClearProfileStateAction => {
  return {
    type: ProfileActionType.CLEAR_PROFILE_STATE,
  }
}
