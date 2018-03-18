import { TagSectionType } from './types'

/* Actions */

export enum ProfileActionType {

  ATTEMPT_UPDATE_PREFERRED_NAME = 'ATTEMPT_UPDATE_PREFERRED_NAME',
  UPDATE_PREFERRED_NAME_SUCCESS = 'UPDATE_PREFERRED_NAME_SUCCESS',
  UPDATE_PREFERRED_NAME_FAILURE = 'UPDATE_PREFERRED_NAME_FAILURE',

  ATTEMPT_UPDATE_MAJOR = 'ATTEMPT_UPDATE_MAJOR',
  UPDATE_MAJOR_SUCCESS = 'UPDATE_MAJOR_SUCCESS',
  UPDATE_MAJOR_FAILURE = 'UPDATE_MAJOR_FAILURE',

  ATTEMPT_UPDATE_BIO = 'ATTEMPT_UPDATE_BIO',
  UPDATE_BIO_SUCCESS = 'UPDATE_BIO_SUCCESS',
  UPDATE_BIO_FAILURE = 'UPDATE_BIO_FAILURE',

  ATTEMPT_UPDATE_IMAGES = 'ATTEMPT_UPDATE_IMAGES',
  UPDATE_IMAGES_SUCCESS = 'UPDATE_IMAGES_SUCCESS',
  UPDATE_IMAGES_FAILURE = 'UPDATE_IMAGES_FAILURE',

  ATTEMPT_UPDATE_TAGS = 'ATTEMPT_UPDATE_TAGS',
  UPDATE_TAGS_SUCCESS = 'UPDATE_TAGS_SUCCESS',
  UPDATE_TAGS_FAILURE = 'UPDATE_TAGS_FAILURE',

  OTHER_ACTION = '__any_other_action_type__',
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

export interface AttemptUpdateImagesAction {
  type: ProfileActionType.ATTEMPT_UPDATE_IMAGES
  images: string[]
}

export interface UpdateImagesSuccessAction {
  type: ProfileActionType.UPDATE_IMAGES_SUCCESS
}

export interface UpdateImagesFailureAction {
  type: ProfileActionType.UPDATE_IMAGES_FAILURE
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

/* the point of the OtherAction action is for TypeScript to warn us if we don't
 * have a default case when processing actions. We will never dispatch
 * OtherAction, but we do need a default case for the other Actions that are
 * dispatched (by third-party plugins and Redux itself). For more information,
 * see https://spin.atomicobject.com/2017/07/24/redux-action-pattern-typescript/
 */

export interface OtherAction {
  type: ProfileActionType.OTHER_ACTION
}

export type ProfileAction = AttemptUpdatePreferredNameAction
| UpdatePreferredNameSuccessAction
| UpdatePreferredNameFailureAction
| AttemptUpdateMajorAction
| UpdateMajorSuccessAction
| UpdateMajorFailureAction
| AttemptUpdateBioAction
| UpdateBioSuccessAction
| UpdateBioFailureAction
| AttemptUpdateImagesAction
| UpdateImagesSuccessAction
| UpdateImagesFailureAction
| AttemptUpdateTagsAction
| UpdateTagsSuccessAction
| UpdateTagsFailureAction
| OtherAction

/* Action Creators */

export const updatePreferredName = (preferredName: string): AttemptUpdatePreferredNameAction => {
  return {
    type: ProfileActionType.ATTEMPT_UPDATE_PREFERRED_NAME,
    preferredName,
  }
}

export const updateMajor = (major: string): AttemptUpdateMajorAction => {
  return {
    type: ProfileActionType.ATTEMPT_UPDATE_MAJOR,
    major,
  }
}

export const updateBio = (bio: string): AttemptUpdateBioAction => {
  return {
    type: ProfileActionType.ATTEMPT_UPDATE_BIO,
    bio,
  }
}

export const updateImages = (images: string[]): AttemptUpdateImagesAction => {
  return {
    type: ProfileActionType.ATTEMPT_UPDATE_IMAGES,
    images,
  }
}

export const updateTags = (tags: TagSectionType[]): AttemptUpdateTagsAction => {
  return {
    type: ProfileActionType.ATTEMPT_UPDATE_TAGS,
    tags,
  }
}
