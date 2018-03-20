import { ProfileActionType, ProfileAction } from './actions'
import { ProfileState } from './types'
import TAGS from './TAGS'
import REACTS from './REACTS'

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
  const newState = Object.assign({}, state)
  switch (action.type) {

    case ProfileActionType.INITIALIZE_PROFILE:
      return {
        ...state,
        id: action.id,
        preferredName: { value: action.preferredName, loading: false },
        bio: { value: action.bio, loading: false },
        images: action.images.map(imageUri => {
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
        prevValue: state.preferredName.value,
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
        prevValue: state.major.value,
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
        prevValue: state.bio.value,
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

      newImages[action.index] = {
        prevValue: state.images[action.index] && state.images[action.index].value,
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
      return {
        ...state,
        images: state.images.map((image, index) => {
          if (index !== action.index) {
            return image
          }
          return {
            prevValue: undefined,
            value: {
              uri: action.imageUri,
              isLocal: false,
            },
            loading: false,
          }
        }),
      }

    case ProfileActionType.UPDATE_IMAGE_FAILURE:
      return {
        ...state,
        images: state.images.map((image, index) => {
          if (index !== action.index) {
            return image
          }
          return {
            prevValue: undefined,
            value: image.prevValue,
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
        prevValue: state.tags.value,
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

    default:
      return state
  }
}
