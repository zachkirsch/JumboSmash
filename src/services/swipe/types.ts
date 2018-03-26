import { List } from 'immutable'
import { LoadableValue } from '../redux'
import { Tag } from '../profile'

export interface User {
  id: number
  preferredName: string
  bio: string
  images: string[]
  tags: Tag[]
}

export interface Match {
  conversation_uuid: string
  createdAt: string
  id: number
  unmatched: boolean
}

export interface SwipeState {
  allUsers: LoadableValue<List<User>>
  indexOfUserOnTop: number
}
