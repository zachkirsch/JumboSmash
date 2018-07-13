import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
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

/* Senior Goal */

function* handleUpdateSeniorGoalSuccess() {
  const successAction: ProfileActions.UpdateSeniorGoalSuccessAction = {
    type: ProfileActions.ProfileActionType.UPDATE_SENIOR_GOAL_SUCCESS,
  }
  yield put(successAction)
}

function* handleUpdateSeniorGoalFailure(error: Error) {
  const failureAction: ProfileActions.UpdateSeniorGoalFailureAction = {
    type: ProfileActions.ProfileActionType.UPDATE_SENIOR_GOAL_FAILURE,
    errorMessage: error.message,
  }
  yield put(failureAction)
}

function* attemptUpdateSeniorGoal(payload: ProfileActions.AttemptUpdateSeniorGoalAction) {
  try {
    yield call(api.api.updateSeniorGoal, payload.seniorGoal)
    yield handleUpdateSeniorGoalSuccess()
  } catch (error) {
    yield handleUpdateSeniorGoalFailure(error)
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

function* attemptUpdateEvents(payload: ProfileActions.AttemptUpdateEventsAction) {
  try {
    api.api.updateEvents(payload.events.reduce((acc, event) => {
      if (event.going) {
        acc.push(event.id)
      }
      return acc
    }, [] as number[]))
    const successAction: ProfileActions.UpdateEventsSuccessAction = {
      type: ProfileActions.ProfileActionType.UPDATE_EVENTS_SUCCESS,
    }
    yield put(successAction)
  } catch (error) {
    const failureAction: ProfileActions.UpdateEventsFailureAction = {
      type: ProfileActions.ProfileActionType.UPDATE_EVENTS_FAILURE,
      errorMessage: error.message,
    }
    yield put(failureAction)
  }
}

function* attemptUpdateBucketList(_: ProfileActions.AttemptUpdateBucketListAction) {
  try {
    // This is commented out because we are handling bucket list locally
    /*
    const completedItems = flatten(payload.items.map(category => {
      return category.items.filter(item => item.completed).map(item => item.id)
    }))
    api.api.updateBucketList(completedItems)
    */
    const successAction: ProfileActions.UpdateBucketListSuccessAction = {
      type: ProfileActions.ProfileActionType.UPDATE_BUCKET_LIST_SUCCESS,
    }
    yield put(successAction)
  } catch (error) {
    const failureAction: ProfileActions.UpdateBucketListFailureAction = {
      type: ProfileActions.ProfileActionType.UPDATE_BUCKET_LIST_FAILURE,
      errorMessage: error.message,
    }
    yield put(failureAction)
  }
}

function* attemptToggleUnderclassmen(payload: ProfileActions.AttemptToggleUnderclassmenAction) {
  try {
    api.api.updateSeeUnderclassmen(payload.showUnderclassmen)
    const successAction: ProfileActions.ToggleUnderclassmenSuccessAction = {
      type: ProfileActions.ProfileActionType.TOGGLE_UNDERCLASSMEN_SUCCESS,
    }
    yield put(successAction)
  } catch (e) {
    const failureAction: ProfileActions.ToggleUnderclassmenFailureAction = {
      type: ProfileActions.ProfileActionType.TOGGLE_UNDERCLASSMEN_FAILURE,
      errorMessage: e.message,
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
    const response = yield all([
      call(api.api.getTags),
      call(api.api.getReacts),
      call(api.api.getEvents),
      call(api.api.getBucketList),
      call(api.api.me),
    ])
    const allTags: api.GetTagsResponse = response[0]
    const allReacts: api.GetReactsResponse = response[1]
    const allEvents: api.GetEventsResponse = response[2]
    const allBucketListItems: api.GetBucketListResponse = response[3]
    const meInfo: api.MeResponse = response[4]
    yield put(ProfileActions.initializeProfile(allTags, allReacts, allEvents, allBucketListItems, meInfo))
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

function* rehydrate() {
  yield put(ProfileActions.rehydrateProfileFromServer())
}

/* main saga */

export function* profileSaga() {
  yield takeLatest(ProfileActions.ProfileActionType.ATTEMPT_UPDATE_PREFERRED_NAME, attemptUpdatePreferredName)
  yield takeLatest(ProfileActions.ProfileActionType.ATTEMPT_UPDATE_BIO, attemptUpdateBio)
  yield takeLatest(ProfileActions.ProfileActionType.ATTEMPT_UPDATE_SENIOR_GOAL, attemptUpdateSeniorGoal)
  yield takeLatest(ProfileActions.ProfileActionType.ATTEMPT_UPDATE_TAGS, attemptUpdateTags)
  yield takeEvery(ProfileActions.ProfileActionType.ATTEMPT_UPDATE_IMAGE, attemptUpdateImage)
  yield takeLatest(ProfileActions.ProfileActionType.ATTEMPT_BLOCK_USER, attemptBlockUser)
  yield takeLatest(ProfileActions.ProfileActionType.ATTEMPT_UNBLOCK_USER, attemptUnblockUser)
  yield takeLatest(ProfileActions.ProfileActionType.ATTEMPT_UPDATE_EVENTS, attemptUpdateEvents)
  yield takeLatest(ProfileActions.ProfileActionType.ATTEMPT_UPDATE_BUCKET_LIST, attemptUpdateBucketList)
  yield takeLatest(ProfileActions.ProfileActionType.ATTEMPT_TOGGLE_UNDERCLASSMEN, attemptToggleUnderclassmen)
  yield takeLatest(
    ProfileActions.ProfileActionType.ATTEMPT_REHYDRATE_PROFILE_FROM_SERVER,
    rehydrateProfileFromServer
  )
  yield takeLatest(ReduxActionType.REHYDRATE, rehydrate)
}
