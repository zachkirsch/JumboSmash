import RNFetchBlob from 'react-native-fetch-blob'
import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import uuid from 'uuid'
import { RootState } from '../../redux'
import * as api from '../api'
import { firebase, getRefToProfile } from '../firebase'
import { LoadableValue, RehydrateAction, ReduxActionType } from '../redux'
import * as ProfileActions from './actions'
import { ImageUri, FirebaseProfile, Tag } from './types'

const getImages = (state: RootState) => state.profile.images

const updateProfileInFirebase = (updateObject: Partial<FirebaseProfile>) => {
  return new Promise((resolve, reject) => {
    const dbRef = getRefToProfile(firebase.auth().currentUser.uid)
    dbRef.update(updateObject, error => error ? reject(error) : resolve())
  })
}

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
    yield call(updateProfileInFirebase, { preferredName: payload.preferredName })
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

function* attemptUpdateMajor(payload: ProfileActions.AttemptUpdateMajorAction) {
  try {
    yield call(updateProfileInFirebase, { major: payload.major })
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
    yield call(updateProfileInFirebase, { bio: payload.bio })
    yield call(api.api.updateBio, payload.bio)
    yield handleUpdateBioSuccess()
  } catch (error) {
    yield handleUpdateBioFailure(error)
  }
}

/* Images */

function* handleUpdateImagesSuccess(index: number, localUri: string, remoteUri: string) {
  const successAction: ProfileActions.UpdateImageSuccessAction = {
    type: ProfileActions.ProfileActionType.UPDATE_IMAGE_SUCCESS,
    localUri,
    remoteUri,
    index,
  }
  yield put(successAction)
}

function* handleUpdateImagesFailure(error: Error, index: number, localUri: string) {
  const failureAction: ProfileActions.UpdateImageFailureAction = {
    type: ProfileActions.ProfileActionType.UPDATE_IMAGE_FAILURE,
    index,
    localUri,
    errorMessage: error.message,
  }
  yield put(failureAction)
}

function* attemptUpdateImages(payload: ProfileActions.AttemptUpdateImageAction) {
  function uploadImageToFirebase() {
    if (payload.imageUri === '') {
      return payload.imageUri
    }
    return new Promise((resolve, reject) => {
      /* tslint:disable:no-any */
      const Blob = RNFetchBlob.polyfill.Blob
      const fs = RNFetchBlob.fs

      const theWindow: any = window
      theWindow.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
      theWindow.Blob = Blob

      let uploadBlob: any

      const imageRef = firebase.storage().ref('images').child('profilePictures').child(uuid.v4())

      fs.readFile(payload.imageUri, 'base64')
      .then((data) => {
        return (Blob as any).build(data, { type: `${payload.mime};BASE64` })
      })
      .then((blob) => {
        uploadBlob = blob
        return imageRef.put(blob, { contentType: payload.mime })
      })
      .then(() => {
        uploadBlob.close()
        return imageRef.getDownloadURL()
      })
      .then((url) => {
        resolve(url)
      })
      .catch((error) => {
        reject(error)
      })
    })
    /* tslint:enable:no-any */
  }

  try {
    let firebaseUrl: string
    if (payload.imageUri.startsWith('http')) { // already a remote url
      firebaseUrl = payload.imageUri
    } else {
      firebaseUrl = yield call(uploadImageToFirebase)
    }

    const images: Array<LoadableValue<ImageUri>> = yield select(getImages)
    const newImages = images.map((image, index) => {
      if (index === payload.index) {
        return firebaseUrl
      } else if (image.value.isLocal) {
        return ''
      } else {
        return image.value.uri
      }
    })

    yield call(updateProfileInFirebase, { imageUris: newImages })

    // send images to server
    yield call(api.api.updateImages, newImages)

    yield handleUpdateImagesSuccess(payload.index, payload.imageUri, firebaseUrl)
  } catch (error) {
    yield handleUpdateImagesFailure(error, payload.index, payload.imageUri)
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

function* attemptUpdateTags(action: ProfileActions.AttemptUpdateTagsAction) {
  try {

    // selectedTags is a map from tag ID to the tag itself, for uploading to firebase
    const selectedTags: { [tagId: number]: Tag } = {}
    action.tags.forEach(tagSection => {
      tagSection.tags.forEach(tag => {
        selectedTags[tag.id] = {
          ...tag,
          selected: !!tag.selected, // since tag.selected can be undefined
        }
      })
    })
    yield call(updateProfileInFirebase, { tags: selectedTags })

    // yield call(api.api.updateTags, payload.tags) TODO: use API to update tags
    yield handleUpdateTagsSuccess()
  } catch (error) {
    yield handleUpdateTagsFailure(error)
  }
}

function* rehydrateProfileFromServer(_: RehydrateAction) {
  try {
    const meInfo: api.MeResponse = yield call(api.api.me)
    yield put(ProfileActions.initializeProfile(
      meInfo.id,
      meInfo.preferred_name,
      meInfo.bio,
      meInfo.images.map((image) => image.url)
    ))
  } catch (e) {} /* tslint:disable-line:no-empty */
}

/* main saga */

export function* profileSaga() {
  yield takeLatest(ProfileActions.ProfileActionType.ATTEMPT_UPDATE_PREFERRED_NAME, attemptUpdatePreferredName)
  yield takeLatest(ProfileActions.ProfileActionType.ATTEMPT_UPDATE_MAJOR, attemptUpdateMajor)
  yield takeLatest(ProfileActions.ProfileActionType.ATTEMPT_UPDATE_BIO, attemptUpdateBio)
  yield takeLatest(ProfileActions.ProfileActionType.ATTEMPT_UPDATE_TAGS, attemptUpdateTags)
  yield takeEvery(ProfileActions.ProfileActionType.ATTEMPT_UPDATE_IMAGE, attemptUpdateImages)
  yield takeLatest(ReduxActionType.REHYDRATE, rehydrateProfileFromServer)
}
