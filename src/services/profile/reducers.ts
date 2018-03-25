import { LoadableValue } from '../redux'
import { ProfileAction, ProfileActionType } from './actions'
import { ReduxActionType } from '../redux'
import REACTS from './REACTS'
import TAGS from './TAGS'
import { ProfileState } from './types'

const initialState: ProfileState = {
  id: -1,
  preferredName: {
    value: '',
    loading: false,
  },
  major: {
    value: '',
    loading: false,
  },
  bio: {
    value: '',
    loading: false,
  },
  images: [],
  tags: {
    value: TAGS,
    loading: false,
  },
  reacts: {
    value: REACTS,
    loading: false,
  },
}

const newImage = () => ({
  value: {
    uri: '',
    isLocal: true,
  },
  loading: false,
})

export function profileReducer(state = initialState, action: ProfileAction): ProfileState {
  const newState = {...state}
  switch (action.type) {

    case ProfileActionType.INITIALIZE_PROFILE:
      return {
        ...state,
        id: action.id,
        preferredName: { value: action.preferredName, loading: false },
        bio: { value: action.bio, loading: false },
        images: action.images.map((imageUri) => {
          return {
            value: {
              uri: imageUri,
              isLocal: false,
            },
            loading: false,
          }
        }),
      }

    /* Preferred Name */

    case ProfileActionType.ATTEMPT_UPDATE_PREFERRED_NAME:
      newState.preferredName = {
        prevValue: state.preferredName.loading ? state.preferredName.prevValue : state.preferredName.value,
        value: action.preferredName,
        loading: true,
      }
      return newState

    case ProfileActionType.UPDATE_PREFERRED_NAME_SUCCESS:
      newState.preferredName.loading = false
      return newState

    case ProfileActionType.UPDATE_PREFERRED_NAME_FAILURE:
      newState.preferredName = {
        prevValue: undefined,
        value: state.preferredName.prevValue,
        loading: false,
        errorMessage: action.errorMessage,
      }
      return newState

    /* Major */

    case ProfileActionType.ATTEMPT_UPDATE_MAJOR:
      newState.major = {
        prevValue: state.major.loading ? state.major.prevValue : state.major.value,
        value: action.major,
        loading: true,
      }
      return newState

    case ProfileActionType.UPDATE_MAJOR_SUCCESS:
      newState.major.loading = false
      return newState

    case ProfileActionType.UPDATE_MAJOR_FAILURE:
      newState.major = {
        prevValue: undefined,
        value: state.major.prevValue,
        loading: false,
        errorMessage: action.errorMessage,
      }
      return newState

    /* Bio */

    case ProfileActionType.ATTEMPT_UPDATE_BIO:
      newState.bio = {
        prevValue: state.bio.loading ? state.bio.prevValue : state.bio.value,
        value: action.bio,
        loading: true,
      }
      return newState

    case ProfileActionType.UPDATE_BIO_SUCCESS:
      newState.bio.loading = false
      return newState

    case ProfileActionType.UPDATE_BIO_FAILURE:
      newState.bio = {
        prevValue: undefined,
        value: state.bio.prevValue,
        loading: false,
        errorMessage: action.errorMessage,
      }
      return newState

    /* Images */

    case ProfileActionType.ATTEMPT_UPDATE_IMAGE:

      let newImages = []
      for (let i = 0; i < Math.max(state.images.length, action.index + 1); i++) {
        newImages.push(state.images[i] || newImage())
      }

      let prevValue
      if (state.images[action.index]) {
        if (state.images[action.index].loading) {
          prevValue = state.images[action.index].prevValue
        } else {
          prevValue = state.images[action.index].value
        }
      }

      newImages[action.index] = {
        prevValue,
        value: {
          uri: action.imageUri,
          isLocal: true,
        },
        loading: true,
      }

      return {
        ...state,
        images: newImages,
      }

    case ProfileActionType.UPDATE_IMAGE_SUCCESS:

      if (action.localUri !== state.images[action.index].value.uri) {
        return state
      }

      return {
        ...state,
        images: state.images.map((image, index) => {
          if (index !== action.index) {
            return image
          }
          return {
            prevValue: undefined,
            value: {
              uri: action.remoteUri,
              isLocal: false,
            },
            loading: false,
          }
        }),
      }

    case ProfileActionType.UPDATE_IMAGE_FAILURE:

      if (action.localUri !== state.images[action.index].value.uri) {
        return state
      }

      return {
        ...state,
        images: state.images.map((image, index) => {
          if (index !== action.index) {
            return image
          }
          return {
            prevValue: undefined,
            value: {
              uri: image.prevValue ? image.prevValue.uri : '',
              isLocal: image.prevValue ? image.prevValue.isLocal : true,
            },
            errorMessage: action.errorMessage,
            loading: false,
          }
        }),
      }

    case ProfileActionType.SWAP_IMAGES:
      if (action.index1 < 0 || action.index2 < 0) {
        return state
      }

      newImages = []
      for (let i = 0; i < Math.max(state.images.length, action.index1 + 1, action.index2 + 1); i++) {
        let toPush = state.images[i]
        if (i === action.index1) {
          toPush = state.images[action.index2]
        } else if (i === action.index2) {
          toPush = state.images[action.index1]
        }
        newImages.push(toPush || newImage())
      }

      return {
        ...state,
        images: newImages,
      }

    /* Tags */

    case ProfileActionType.ATTEMPT_UPDATE_TAGS:
      newState.tags = {
        prevValue: state.tags.loading ? state.tags.prevValue : state.tags.value,
        value: action.tags,
        loading: true,
      }
      return newState

    case ProfileActionType.UPDATE_TAGS_SUCCESS:
      newState.tags.loading = false
      return newState

    case ProfileActionType.UPDATE_TAGS_FAILURE:
      newState.tags = {
        prevValue: undefined,
        value: state.tags.prevValue,
        loading: false,
        errorMessage: action.errorMessage,
      }
      return newState

    case ReduxActionType.REHYDRATE:

      // for unit tests when root state is empty
      if (!action.payload.profile) {
        return state
      }

      function getValue<T>(oldStateValue: LoadableValue<T>, defaultValue: T): LoadableValue<T> {
        let value: T
        if (oldStateValue.loading) {
          if (oldStateValue.prevValue !== undefined) {
            value = oldStateValue.prevValue
          } else {
            value = defaultValue
          }
        } else {
          value = oldStateValue.value
        }
        return {
          value,
          loading: false,
        }
      }

      return {
        id: action.payload.profile.id,
        preferredName: getValue(action.payload.profile.preferredName, initialState.preferredName.value),
        major: getValue(action.payload.profile.major, initialState.major.value),
        bio: getValue(action.payload.profile.bio, initialState.bio.value),
        images: action.payload.profile.images.map((image) => getValue(image, {uri: '', isLocal: true})),
        tags: getValue(action.payload.profile.tags, initialState.tags.value),
        reacts: getValue(action.payload.profile.reacts, initialState.reacts.value),
      }

    default:
      return state
  }
}
