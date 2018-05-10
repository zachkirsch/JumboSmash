import { List } from 'immutable'
import moment from 'moment'
import { LoadableValue } from '../redux'
import { ProfileAction, ProfileActionType } from './actions'
import { ReduxActionType } from '../redux'
import {
  ProfileState,
  ImageUri,
  EmojiProfileReact,
  ImageProfileReact,
  ProfileReact,
} from './types'
import { AuthActionType } from '../auth'

const initialState: ProfileState = {
  id: -1,
  rehydratingProfileFromServer: false,
  preferredName: {
    value: '',
    loading: false,
  },
  surname: '',
  fullName: '',
  classYear: -1,
  bio: {
    value: '',
    loading: false,
  },
  seniorGoal: {
    value: '',
    loading: false,
  },
  images: List(),
  tags: {
    value: [],
    loading: false,
  },
  profileReacts: {
    value: [],
    loading: false,
  },
  events: {
    value: [],
    loading: false,
  },
  blockedUsers: List(),
  showUnderclassmen: {
    value: false,
    loading: false,
  },
  whoReacted: [],
  bucketList: {
    value: [],
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

    case ProfileActionType.ATTEMPT_REHYDRATE_PROFILE_FROM_SERVER:
      return {
        ...state,
        rehydratingProfileFromServer: true,
      }

    case ProfileActionType.INITIALIZE_PROFILE:
      const selectedTagIds = action.payload.tags.map(tag => tag.id)
      return {
        rehydratingProfileFromServer: false,
        id: action.payload.id,
        preferredName: { value: action.payload.preferred_name || '', loading: false },
        surname: action.payload.surname,
        fullName: action.payload.full_name,
        classYear: action.payload.class_year,
        bio: { value: action.payload.bio, loading: false },
        seniorGoal: { value: '' /* TODO action.payload.senior_goal */, loading: false },
        images: List(action.payload.images.map(({url}) => {
          return {
            value: {
              uri: url,
              isLocal: false,
            },
            loading: false,
          }
        })),
        tags: {
          value: action.allTags.map(category => {
            return {
              name: category.cat_text,
              tags: category.tags.map(tag => ({
                id: tag.tag_id,
                name: tag.tag_text,
                emoji: tag.tag_type === 'emoji',
                selected: !!selectedTagIds.find(selectedTagId => selectedTagId === tag.tag_id),
              })),
            }
          }),
          loading: false,
        },
        blockedUsers: List(action.payload.blocked_users.map(email => ({
          value: {
            email,
            blocked: true,
          },
          loading: false,
        }))),
        profileReacts: {
          value: action.allReacts.map(r => {
            const react = action.payload.profile_reacts.find(profileReact => profileReact.react_id === r.id)!
            if (react.react_type === 'emoji') {
              const emojiReact: EmojiProfileReact = {
                type: 'emoji',
                id: react.react_id,
                emoji: react.react_text,
                count: react.react_count,
              }
              return emojiReact
            } else if (react.react_type === 'image') {
              const imageReact: ImageProfileReact = {
                type: 'image',
                id: react.react_id,
                imageUri: react.react_text,
                count: react.react_count,
              }
              return imageReact
            } else {
              return undefined
            }
          }).filter(r => r) as ProfileReact[],
          loading: false,
        },
        showUnderclassmen: {
          value: false,
          loading: false,
        }, // TODO, with server
        events: {
          loading: false,
          value: action.allEvents.map(event => {
            return {
              id: event.id,
              time: moment(event.start_at).valueOf(),
              location: event.location,
              going: !!action.payload.events.find(e => e.event_id === event.id),
              name: event.name,
            }
          }).sort((a, b) => a.time - b.time),
        },
        whoReacted: action.payload.who_reacted.map(react => ({
          reactId: react.react_id,
          byUser: react.user_from_id,
        })),
        bucketList: {
          loading: false,
          value: action.allBucketListItems.map(category => ({
            name: category.cat_text,
            items: category.items.map(item => ({
              id: item.item_id,
              text: item.item_text,
              category: item.cat_text,
              completed: !!state.bucketList.value
                .find(c => c.name === category.cat_text && !!c.items.find(i => i.id === item.item_id && i.completed)),
            })),
          })),
        },
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
        value: state.preferredName.prevValue || '',
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
        value: state.bio.prevValue || '',
        loading: false,
        errorMessage: action.errorMessage,
      }
      return newState

    /* SeniorGoal */

    case ProfileActionType.ATTEMPT_UPDATE_SENIOR_GOAL:
      newState.seniorGoal = {
        prevValue: state.seniorGoal.loading ? state.seniorGoal.prevValue : state.seniorGoal.value,
        value: action.seniorGoal,
        loading: true,
      }
      return newState

    case ProfileActionType.UPDATE_SENIOR_GOAL_SUCCESS:
      newState.seniorGoal.loading = false
      return newState

    case ProfileActionType.UPDATE_SENIOR_GOAL_FAILURE:
      newState.seniorGoal = {
        prevValue: undefined,
        value: state.seniorGoal.prevValue || '',
        loading: false,
        errorMessage: action.errorMessage,
      }
      return newState

    /* Images */

    case ProfileActionType.ATTEMPT_UPDATE_IMAGE:

      let newImages: List<LoadableValue<ImageUri>> = List()
      for (let i = 0; i < Math.max(state.images.size, action.index + 1); i++) {
        newImages = newImages.push(state.images.get(i) || newImage())
      }

      let prevValue
      if (state.images.get(action.index)) {
        if (state.images.get(action.index).loading) {
          prevValue = state.images.get(action.index).prevValue
        } else {
          prevValue = state.images.get(action.index).value
        }
      }

      newImages = newImages.set(action.index, {
        prevValue,
        value: {
          uri: action.imageUri,
          isLocal: true,
        },
        loading: true,
      })

      return {
        ...state,
        images: newImages,
      }

    case ProfileActionType.UPDATE_IMAGE_SUCCESS:

      if (!state.images.get(action.index) || action.localUri !== state.images.get(action.index).value.uri) {
        return state
      }

      return {
        ...state,
        images: state.images.map((image, index) => {
          if (image && index !== action.index) {
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
        }).toList(),
      }

    case ProfileActionType.UPDATE_IMAGE_FAILURE:

      if (!state.images.get(action.index) || action.localUri !== state.images.get(action.index).value.uri) {
        return state
      }

      return {
        ...state,
        images: state.images.map((image, index) => {
          if (image && index !== action.index) {
            return image
          }
          return {
            prevValue: undefined,
            value: {
              uri: image && image.prevValue ? image.prevValue.uri : '',
              isLocal: image && image.prevValue ? image.prevValue.isLocal : true,
            },
            errorMessage: action.errorMessage,
            loading: false,
          }
        }).toList(),
      }

    case ProfileActionType.SWAP_IMAGES:
      if (action.index1 < 0 || action.index2 < 0) {
        return state
      }

      newImages = List()
      for (let i = 0; i < Math.max(state.images.size, action.index1 + 1, action.index2 + 1); i++) {
        let toPush = state.images.get(i)
        if (i === action.index1) {
          toPush = state.images.get(action.index2)
        } else if (i === action.index2) {
          toPush = state.images.get(action.index1)
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
      newState.tags = {
        value: newState.tags.value,
        loading: false,
      }
      return newState

    case ProfileActionType.UPDATE_TAGS_FAILURE:
      newState.tags = {
        prevValue: undefined,
        value: state.tags.prevValue || [],
        loading: false,
        errorMessage: action.errorMessage,
      }
      return newState

    /* Events */

    case ProfileActionType.ATTEMPT_UPDATE_EVENTS:
      newState.events = {
        prevValue: state.events.loading ? state.events.prevValue : state.events.value,
        value: action.events,
        loading: true,
      }
      return newState

    case ProfileActionType.UPDATE_EVENTS_SUCCESS:
      newState.events = {
        value: newState.events.value,
        loading: false,
      }
      return newState

    case ProfileActionType.UPDATE_EVENTS_FAILURE:
      newState.events = {
        prevValue: undefined,
        value: state.events.prevValue!,
        loading: false,
        errorMessage: action.errorMessage,
      }
      return newState

    /* Bucket List */

    case ProfileActionType.ATTEMPT_UPDATE_BUCKET_LIST:
      newState.bucketList = {
        prevValue: state.bucketList.loading ? state.bucketList.prevValue : state.bucketList.value,
        value: action.items,
        loading: true,
      }
      return newState

    case ProfileActionType.UPDATE_BUCKET_LIST_SUCCESS:
      newState.bucketList = {
        value: newState.bucketList.value,
        loading: false,
      }
      return newState

    case ProfileActionType.UPDATE_BUCKET_LIST_FAILURE:
      newState.bucketList = {
        prevValue: undefined,
        value: state.bucketList.prevValue!,
        loading: false,
        errorMessage: action.errorMessage,
      }
      return newState

    case ProfileActionType.ATTEMPT_BLOCK_USER:
      let userExists = !!state.blockedUsers.find(user => {
        if (!user) {
          return false
        }
        return user.value.email === action.email
      })
      if (!userExists) {
        newState.blockedUsers = state.blockedUsers.unshift({
          value: {
            email: action.email,
            blocked: true,
          },
          loading: true,
        })
      } else {
        newState.blockedUsers = state.blockedUsers.map(blockedUser => {
          if (!blockedUser || blockedUser.value.email !== action.email) {
            return blockedUser!
          }
          return {
            prevValue: blockedUser.value,
            value: {
              email: action.email,
              blocked: true,
            },
            loading: true,
          }
        }).toList()
      }
      return newState

    case ProfileActionType.BLOCK_USER_SUCCESS:
    case ProfileActionType.UNBLOCK_USER_SUCCESS:
      newState.blockedUsers = state.blockedUsers.map(blockedUser => {
        if (!blockedUser || blockedUser.value.email !== action.email) {
          return blockedUser!
        }
        return {
          ...blockedUser,
          loading: false,
        }
      }).toList()
      return newState

    case ProfileActionType.BLOCK_USER_FAILURE:
    case ProfileActionType.UNBLOCK_USER_FAILURE:
      newState.blockedUsers = state.blockedUsers.map(blockedUser => {
        if (!blockedUser || blockedUser.value.email !== action.email) {
          return blockedUser!
        }
        return {
          value: {
            email: action.email,
            blocked: blockedUser.prevValue
              ? blockedUser.prevValue.blocked
              : action.type === ProfileActionType.UNBLOCK_USER_FAILURE,
          },
          loading: false,
        }
      }).toList()
      return newState

    case ProfileActionType.ATTEMPT_UNBLOCK_USER:
      newState.blockedUsers = state.blockedUsers.map(blockedUser => {
        if (!blockedUser || blockedUser.value.email !== action.email) {
          return blockedUser!
        }
        return {
          prevValue: blockedUser.value,
          value: {
            email: action.email,
            blocked: false,
          },
          loading: true,
        }
      }).toList()
      return newState

    case ProfileActionType.UPDATE_PROFILE_REACTS:
      const newReacts: ProfileReact[] = []
      state.profileReacts.value.forEach(react => {
        const newReact = action.profileReacts.find(r => r.react_id === react.id)
        newReacts.push({
          ...react,
          count: newReact ? newReact.react_count : 0,
        })
      })
      newState.profileReacts = {
        value: newReacts,
        loading: false,
      }
      newState.whoReacted = action.whoReacted.map(react => ({
        reactId: react.react_id,
        byUser: react.user_from_id,
      }))
      return newState

    case ProfileActionType.ATTEMPT_TOGGLE_UNDERCLASSMEN:
      return {
        ...state,
        showUnderclassmen: {
          prevValue: state.showUnderclassmen.loading
            ? state.showUnderclassmen.prevValue
            : state.showUnderclassmen.value,
          value: action.showUnderclassmen,
          loading: true,
        },
      }

    case ProfileActionType.TOGGLE_UNDERCLASSMEN_SUCCESS:
      return {
        ...state,
        showUnderclassmen: {
          value: state.showUnderclassmen.value,
          loading: false,
        },
      }

    case ProfileActionType.TOGGLE_UNDERCLASSMEN_FAILURE:
      return {
        ...state,
        showUnderclassmen: {
          value: state.showUnderclassmen.prevValue || initialState.showUnderclassmen.value,
          errorMessage: action.errorMessage,
          loading: false,
        },
      }

    case AuthActionType.VERIFY_EMAIL_SUCCESS:
      return {
        ...state,
        classYear: action.classYear,
      }

    case ReduxActionType.REHYDRATE:

      // for when root state is empty
      if (!action.payload.profile) {
        return state
      }

      function getValue<T>(oldStateValue: LoadableValue<T>, defaultValue: T): LoadableValue<T> {
        let value: T
        if (!oldStateValue) {
          value = defaultValue
        } else if (oldStateValue.loading) {
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
        rehydratingProfileFromServer: false,
        id: action.payload.profile.id,
        preferredName: getValue(action.payload.profile.preferredName, initialState.preferredName.value),
        surname: action.payload.profile.surname,
        fullName: action.payload.profile.fullName,
        classYear: action.payload.profile.classYear,
        bio: getValue(action.payload.profile.bio, initialState.bio.value),
        seniorGoal: getValue(action.payload.profile.seniorGoal, initialState.seniorGoal.value),
        images: List(action.payload.profile.images.map(image => getValue(image!, {uri: '', isLocal: true}))),
        tags: getValue(action.payload.profile.tags, initialState.tags.value),
        profileReacts: getValue(action.payload.profile.profileReacts, initialState.profileReacts.value),
        events: getValue(action.payload.profile.events, initialState.events.value),
        bucketList: getValue(action.payload.profile.bucketList, initialState.bucketList.value),
        blockedUsers: List(action.payload.profile.blockedUsers.map(user => getValue(user!, {email: '', blocked: false}))),
        showUnderclassmen: action.payload.profile.showUnderclassmen,
        whoReacted: action.payload.profile.whoReacted,
      }

    case ProfileActionType.CLEAR_PROFILE_STATE:
      return {
        ...initialState,
      }

    default:
      return state
  }
}
