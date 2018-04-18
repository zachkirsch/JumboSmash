import { TagSectionType } from './types'
import { RehydrateAction } from '../redux'

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

  ATTEMPT_UPDATE_TAGS = 'ATTEMPT_UPDATE_TAGS',
  UPDATE_TAGS_SUCCESS = 'UPDATE_TAGS_SUCCESS',
  UPDATE_TAGS_FAILURE = 'UPDATE_TAGS_FAILURE',

  CLEAR_PROFILE_STATE = 'CLEAR_PROFILE_STATE',

  OTHER_ACTION = '__any_other_action_type__',
}

export interface InitializeProfileAciton {
  type: ProfileActionType.INITIALIZE_PROFILE
  id: number
  preferredName: string
  surname: string
  fullName: string
  bio: string
  images: string[]
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

export type ProfileAction = InitializeProfileAciton
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
| AttemptUpdateTagsAction
| UpdateTagsSuccessAction
| UpdateTagsFailureAction
| ClearProfileStateAction
| RehydrateAction
| OtherAction

/* Action Creators */

export const initializeProfile = (id: number, preferredName: string, surname: string, fullName: string,
                                  bio: string, images: string[]): InitializeProfileAciton => {
  return {
    type: ProfileActionType.INITIALIZE_PROFILE,
    id,
    preferredName,
    surname,
    fullName,
    bio,
    images,
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

export const updateTags = (tags: TagSectionType[]): AttemptUpdateTagsAction => {
  return {
    type: ProfileActionType.ATTEMPT_UPDATE_TAGS,
    tags,
  }
}

export const clearProfileState = (): ClearProfileStateAction => {
  return {
    type: ProfileActionType.CLEAR_PROFILE_STATE,
  }
}
