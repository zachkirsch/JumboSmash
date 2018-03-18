import { ProfileActionType, ProfileAction } from './actions'
import { ProfileState } from './types'
import TAGS from './TAGS'
import REACTS from './REACTS'

const initialState: ProfileState = {
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
  images: {
    value: [],
    loading: false,
  },
  tags: {
    value: TAGS,
    loading: false,
  },
  reacts: {
    value: REACTS,
    loading: false,
  },
}

export function profileReducer(state = initialState, action: ProfileAction): ProfileState {
  const newState = Object.assign({}, state)
  switch (action.type) {

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

    case ProfileActionType.ATTEMPT_UPDATE_IMAGES:
      newState.images = {
        prevValue: state.images.value,
        value: action.images,
        loading: true,
      }
      return newState

    case ProfileActionType.UPDATE_IMAGES_SUCCESS:
      newState.images.loading = false
      return newState

    case ProfileActionType.UPDATE_IMAGES_FAILURE:
      newState.images = {
        prevValue: undefined,
        value: state.images.value, // TODO: prevValue?
        loading: false,
        errorMessage: action.errorMessage,
      }
      return newState

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
