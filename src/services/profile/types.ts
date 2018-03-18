import { LoadableValue } from '../redux'

export interface Tag {
  name: string
  emoji?: boolean
  selected?: boolean
}

export interface TagSectionType {
  name: string
  tags: Tag[]
}

interface EmojiProfileReact {
  type: 'emoji'
  emoji: string
}

interface ImageProfileReact {
  type: 'image'
  imageName: string
}

export type ProfileReact = (EmojiProfileReact | ImageProfileReact) & { count: number }

export interface ProfileState {
  preferredName: LoadableValue<string>
  major: LoadableValue<string>
  bio: LoadableValue<string>
  images: LoadableValue<string[]>
  tags: LoadableValue<TagSectionType[]>
  reacts: LoadableValue<ProfileReact[]>
}
