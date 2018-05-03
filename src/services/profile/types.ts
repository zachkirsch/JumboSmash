import { List } from 'immutable'
import { LoadableValue } from '../redux'

export const EMOJI_REGEX = /^[A-Za-z0-9\ ]*$/

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

export type ProfileReact = ReactableProfileReact & (EmojiProfileReact | ImageProfileReact)

export interface BlockedUser {
  email: string
  blocked: boolean
}

export interface ProfileState {
  id: number
  preferredName: LoadableValue<string>
  surname: string
  fullName: string
  classYear: number
  major: LoadableValue<string>
  bio: LoadableValue<string>
  images: List<LoadableValue<ImageUri>>
  tags: LoadableValue<TagSectionType[]>
  profileReacts: LoadableValue<ProfileReact[]>
  allReacts: (BaseEmojiProfileReact | BaseImageProfileReact)[]
  blockedUsers: List<LoadableValue<BlockedUser>>
  showUnderclassmen: boolean
}
