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

interface BaseProfileReact {
  id: number
  count: number
}

export interface EmojiProfileReact extends BaseProfileReact {
  type: 'emoji'
  emoji: string
}

export interface ImageProfileReact extends BaseProfileReact {
  type: 'image'
  imageUri: string
}

export interface ImageUri {
  uri: string
  isLocal: boolean
}

export type ProfileReact = EmojiProfileReact | ImageProfileReact

export interface BlockedUser {
  email: string
  blocked: boolean
}

export interface ProfileState {
  id: number
  preferredName: LoadableValue<string>
  surname: string
  fullName: string
  major: LoadableValue<string>
  bio: LoadableValue<string>
  images: List<LoadableValue<ImageUri>>
  tags: LoadableValue<TagSectionType[]>
  reacts: LoadableValue<ProfileReact[]>
  blockedUsers: List<LoadableValue<BlockedUser>>
}
