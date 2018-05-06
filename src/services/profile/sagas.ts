import { throttle, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import uuid from 'uuid'
import { List } from 'immutable'
import { RootState } from '../../redux'
import * as api from '../api'
import firebase from 'react-native-firebase'
import { flatten } from 'lodash'
import { LoadableValue, RehydrateAction, ReduxActionType } from '../redux'
import * as ProfileActions from './actions'
import { rehydrateMatchesFromServer, unmatch, Conversation } from '../matches'
import { User } from '../swipe'
import { ImageUri } from './types'

const getImages = (state: RootState) => state.profile.images
const getSignedInStatus = (state: RootState) => state.auth.loggedIn.value
const getChats = (state: RootState) => state.matches.chats.valueSeq().toArray()
const getAllUsers = (state: RootState) => state.swipe.allUsers.value.toObject()

function* isMatched(email: string) {
  const chats: Conversation[] = yield select(getChats)
  const allUsers: { [userId: string]: User } = yield select(getAllUsers)
  return chats.find(convo => {
    if (!convo) {
      return false
    }
    return !!convo.otherUsers.find(userId => {
      if (!userId) {
        return false
      }
      const user = allUsers[userId]
      return user && user.email === email
    })
  })
}

/* Preferred Name */

function* onChangePreferredNameTextInput(action: ProfileActions.OnChangePreferredNameTextInputAction) {
  const updateLocallyAction: ProfileActions.UpdatePreferredNameLocallyAction = {
    type: ProfileActions.ProfileActionType.UPDATE_PREFERRED_NAME_LOCALLY,
    preferredName: action.preferredName,
  }
  yield put(updateLocallyAction)
}

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

/* Bio */

function* onChangeBioTextInput(action: ProfileActions.OnChangeBioTextInputAction) {
  const updateLocallyAction: ProfileActions.UpdateBioLocallyAction = {
    type: ProfileActions.ProfileActionType.UPDATE_BIO_LOCALLY,
    bio: action.bio,
  }
  yield put(updateLocallyAction)
}

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

function* attemptUpdateImage(payload: ProfileActions.AttemptUpdateImageAction) {
  function uploadImageToFirebase() {
    if (payload.imageUri === '') {
      return payload.imageUri
    }
    return new Promise((resolve, reject) => {
      const imageRef = firebase.storage().ref('images').child('profilePictures').child(uuid.v4())
      imageRef
        .put(payload.imageUri, { contentType: payload.mime })
        .then(file => file.downloadURL)
        .then(url => resolve(url))
        .catch(error => reject(error))
    })
  }

  try {
    let firebaseUrl: string
    if (payload.imageUri.startsWith('http')) { // already a remote url
      firebaseUrl = payload.imageUri
    } else {

      firebaseUrl = yield call(uploadImageToFirebase)

      const images: List<LoadableValue<ImageUri>> = yield select(getImages)
      const newImages: string[] = images.map((image, index) => {
        if (index === payload.index) {
          return firebaseUrl
        } else if (!image || image.value.isLocal) {
          return ''
        } else {
          return image.value.uri
        }
      }).toJS()

      // send images to server
      yield call(api.api.updateImages, newImages)
    }

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

function* attemptUpdateTags(payload: ProfileActions.AttemptUpdateTagsAction) {
  try {
    const selectedTagIds = flatten(payload.tags.map(category => {
      return flatten(category.tags.filter(tag => tag.selected).map(tag => tag.id))
    }))
    yield call(api.api.updateTags, selectedTagIds)
    yield handleUpdateTagsSuccess()
  } catch (error) {
    yield handleUpdateTagsFailure(error)
  }
}

function* attemptBlockUser(payload: ProfileActions.AttemptBlockUserAction) {
  try {
    api.api.block(payload.email)

    // if they're current matched, then unmatch
    const conversation: Conversation | undefined = yield call(isMatched, payload.email)
    if (conversation) {
      yield put(unmatch(conversation.matchId, conversation.conversationId))
    }

    const successAction: ProfileActions.BlockUserSuccessAction = {
      type: ProfileActions.ProfileActionType.BLOCK_USER_SUCCESS,
      email: payload.email,
    }
    yield put(successAction)
  } catch (error) {
    const failureAction: ProfileActions.BlockUserFailureAction = {
      type: ProfileActions.ProfileActionType.BLOCK_USER_FAILURE,
      email: payload.email,
      errorMessage: error.message,
    }
    yield put(failureAction)
  }
}

function* attemptUnblockUser(payload: ProfileActions.AttemptUnblockUserAction) {
  try {
    api.api.unblock(payload.email)
    const successAction: ProfileActions.UnblockUserSuccessAction = {
      type: ProfileActions.ProfileActionType.UNBLOCK_USER_SUCCESS,
      email: payload.email,
    }
    yield put(successAction)
  } catch (error) {
    const failureAction: ProfileActions.UnblockUserFailureAction = {
      type: ProfileActions.ProfileActionType.UNBLOCK_USER_FAILURE,
      email: payload.email,
      errorMessage: error.message,
    }
    yield put(failureAction)
  }
}

function* rehydrateProfileFromServer(_: RehydrateAction) {

  const loggedIn: boolean = yield select(getSignedInStatus)
  if (!loggedIn) {
    return
  }

  try {
    const allTags: api.GetTagsResponse = yield call(api.api.getTags)
    const allReacts: api.GetReactsResponse = yield call(api.api.getReacts)
    const meInfo: api.MeResponse = yield call(api.api.me)
    yield put(ProfileActions.initializeProfile(allTags, allReacts, meInfo))
    yield put(rehydrateMatchesFromServer(meInfo.active_matches
      .filter(match => !match.unmatched)
      .map(match => ({
        id: match.id,
        createdAt: match.createdAt,
        otherUsers: match.users.reduce((acc, user) => {
          if (user.id !== meInfo.id) {
            acc.push(user.id)
          }
          return acc
        }, [] as number[]),
        conversationId: match.conversation_uuid,
      }))
    ))
  } catch (e) {} /* tslint:disable-line:no-empty */ // TODO: something?
}

/* main saga */

export function* profileSaga() {
  yield takeLatest(ProfileActions.ProfileActionType.ATTEMPT_UPDATE_PREFERRED_NAME, attemptUpdatePreferredName)
  yield takeLatest(ProfileActions.ProfileActionType.ATTEMPT_UPDATE_BIO, attemptUpdateBio)
  yield takeLatest(ProfileActions.ProfileActionType.ATTEMPT_UPDATE_TAGS, attemptUpdateTags)
  yield takeEvery(ProfileActions.ProfileActionType.ATTEMPT_UPDATE_IMAGE, attemptUpdateImage)
  yield takeLatest(ProfileActions.ProfileActionType.ATTEMPT_BLOCK_USER, attemptBlockUser)
  yield takeLatest(ProfileActions.ProfileActionType.ATTEMPT_UNBLOCK_USER, attemptUnblockUser)
  yield takeLatest(ReduxActionType.REHYDRATE, rehydrateProfileFromServer)
  yield throttle(
    500,
    ProfileActions.ProfileActionType.ON_CHANGE_PREFERRED_NAME_TEXTINPUT,
    onChangePreferredNameTextInput
  )
  yield throttle(
    500,
    ProfileActions.ProfileActionType.ON_CHANGE_BIO_TEXTINPUT,
    onChangeBioTextInput
  )
}
