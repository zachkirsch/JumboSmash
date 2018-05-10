import { List } from 'immutable'
import { LoadableValue } from '../redux'

export interface Tag {
  id: number
  name: string
  emoji?: boolean
  selected?: boolean
}

export interface TagSectionType {
  name: string
  tags: Tag[]
}

export interface BaseEmojiProfileReact {
  type: 'emoji'
  id: number
  emoji: string
}

export interface BaseImageProfileReact {
  type: 'image'
  id: number
  imageUri: string
}

export type BaseProfileReact = BaseEmojiProfileReact | BaseImageProfileReact

interface ReactableProfileReact {
  id: number
  count: number
  reacted?: boolean // whether the user of this phone has reacted in this way
}

export type EmojiProfileReact = ReactableProfileReact & BaseEmojiProfileReact

export type ImageProfileReact = ReactableProfileReact & BaseImageProfileReact

export interface ImageUri {
  uri: string
  isLocal: boolean
}

export type ProfileReact = EmojiProfileReact | ImageProfileReact

export interface IndividualProfileReact {
  reactId: number
  byUser: number
}

export interface BlockedUser {
  email: string
  blocked: boolean
}

export interface Event {
  id: number
  time: number
  name: string
  location: string
  going: boolean
}

export interface BucketListItem {
  id: number
  text: string
  category: string
  completed: boolean
}

export interface BucketListCategory {
  name: string
  items: BucketListItem[]
}

export interface ProfileState {
  rehydratingProfileFromServer: boolean
  id: number
  preferredName: LoadableValue<string>
  surname: string
  fullName: string
  classYear: number
  bio: LoadableValue<string>
  seniorGoal: LoadableValue<string>
  images: List<LoadableValue<ImageUri>>
  tags: LoadableValue<TagSectionType[]>
  profileReacts: LoadableValue<ProfileReact[]>
  events: LoadableValue<Event[]>
  blockedUsers: List<LoadableValue<BlockedUser>>
  showUnderclassmen: LoadableValue<boolean>
  whoReacted: IndividualProfileReact[]
  bucketList: LoadableValue<BucketListCategory[]>
}
