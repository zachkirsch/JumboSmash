import { call, put, throttle, takeLatest } from 'redux-saga/effects'
import * as api from '../api'
import * as ProfileActions from './actions'
// import { flatten } from 'lodash'

/* Preferred Name */

function* handleUpdatePreferredNameSuccess() {
  const successAction: ProfileActions.UpdatePreferredNameSuccessAction = {
    type: ProfileActions.ProfileActionType.UPDATE_PREFERRED_NAME_SUCCESS,
  }
  yield put(successAction)
}

function* handleUpdatePreferredNameFailure(error: Error) {
  const failureAction: ProfileActions.UpdatePreferredNameFailureAction = {
    type: ProfileActions.ProfileActionType.UPDATE_PREFERRED_NAME_FAILURE,
    errorMessage: error.message,
  }
  yield put(failureAction)
}

function* attemptUpdatePreferredName(payload: ProfileActions.AttemptUpdatePreferredNameAction) {
  try {
    yield call(api.api.updateName, payload.preferredName)
    yield handleUpdatePreferredNameSuccess()
  } catch (error) {
    yield handleUpdatePreferredNameFailure(error)
  }
}

/* Major */

function* handleUpdateMajorSuccess() {
  const successAction: ProfileActions.UpdateMajorSuccessAction = {
    type: ProfileActions.ProfileActionType.UPDATE_MAJOR_SUCCESS,
  }
  yield put(successAction)
}

function* handleUpdateMajorFailure(error: Error) {
  const failureAction: ProfileActions.UpdateMajorFailureAction = {
    type: ProfileActions.ProfileActionType.UPDATE_MAJOR_FAILURE,
    errorMessage: error.message,
  }
  yield put(failureAction)
}

function* attemptUpdateMajor(_: ProfileActions.AttemptUpdateMajorAction) {
  try {
    // yield call(api.api.updateMajor, payload.major) TODO: update major via API
    yield handleUpdateMajorSuccess()
  } catch (error) {
    yield handleUpdateMajorFailure(error)
  }
}

/* Bio */

function* handleUpdateBioSuccess() {
  const successAction: ProfileActions.UpdateBioSuccessAction = {
    type: ProfileActions.ProfileActionType.UPDATE_BIO_SUCCESS,
  }
  yield put(successAction)
}

function* handleUpdateBioFailure(error: Error) {
  const failureAction: ProfileActions.UpdateBioFailureAction = {
    type: ProfileActions.ProfileActionType.UPDATE_BIO_FAILURE,
    errorMessage: error.message,
  }
  yield put(failureAction)
}

function* attemptUpdateBio(payload: ProfileActions.AttemptUpdateBioAction) {
  try {
    yield call(api.api.updateBio, payload.bio)
    yield handleUpdateBioSuccess()
  } catch (error) {
    yield handleUpdateBioFailure(error)
  }
}

/* Images */

function* handleUpdateImagesSuccess() {
  const successAction: ProfileActions.UpdateImagesSuccessAction = {
    type: ProfileActions.ProfileActionType.UPDATE_IMAGES_SUCCESS,
  }
  yield put(successAction)
}

function* handleUpdateImagesFailure(error: Error) {
  const failureAction: ProfileActions.UpdateImagesFailureAction = {
    type: ProfileActions.ProfileActionType.UPDATE_IMAGES_FAILURE,
    errorMessage: error.message,
  }
  yield put(failureAction)
}

function* attemptUpdateImages(payload: ProfileActions.AttemptUpdateImagesAction) {
  try {
    yield call(api.api.updateImages, payload.images)
    yield handleUpdateImagesSuccess()
  } catch (error) {
    yield handleUpdateImagesFailure(error)
  }
}

/* Tags */

function* handleUpdateTagsSuccess() {
  const successAction: ProfileActions.UpdateTagsSuccessAction = {
    type: ProfileActions.ProfileActionType.UPDATE_TAGS_SUCCESS,
  }
  yield put(successAction)
}

function* handleUpdateTagsFailure(error: Error) {
  const failureAction: ProfileActions.UpdateTagsFailureAction = {
    type: ProfileActions.ProfileActionType.UPDATE_TAGS_FAILURE,
    errorMessage: error.message,
  }
  yield put(failureAction)
}

function* attemptUpdateTags(_: ProfileActions.AttemptUpdateTagsAction) {
  try {
    // const chosenTags = flatten(payload.tags.map(section => section.tags.filter(tag => tag.selected)))
    // yield call(api.api.updateTags, payload.tags) TODO: use API to update tags
    yield handleUpdateTagsSuccess()
  } catch (error) {
    yield handleUpdateTagsFailure(error)
  }
}

/* main saga */

export function* profileSaga() {
  yield throttle(2000, ProfileActions.ProfileActionType.ATTEMPT_UPDATE_PREFERRED_NAME, attemptUpdatePreferredName)
  yield throttle(2000, ProfileActions.ProfileActionType.ATTEMPT_UPDATE_MAJOR, attemptUpdateMajor)
  yield throttle(2000, ProfileActions.ProfileActionType.ATTEMPT_UPDATE_BIO, attemptUpdateBio)
  yield takeLatest(ProfileActions.ProfileActionType.ATTEMPT_UPDATE_TAGS, attemptUpdateTags)
  yield takeLatest(ProfileActions.ProfileActionType.ATTEMPT_UPDATE_IMAGES, attemptUpdateImages)
}
