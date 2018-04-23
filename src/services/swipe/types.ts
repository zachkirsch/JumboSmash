import { List } from 'immutable'
import { LoadableValue } from '../redux'
import { ProfileReact } from '../profile'

interface Tag {
  name: string
  emoji: boolean
}

export interface User {
  id: number
  preferredName: string
  surname: string
  fullName: string
  major: string
  bio: string
  images: string[]
  profileReacts: ProfileReact[]
  tags: Tag[]
}

export interface SwipeState {
  allUsers: LoadableValue<List<User>>
  indexOfUserOnTop: number
  lastFetched?: number // Unix timestamp
}
