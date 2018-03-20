import { List } from 'immutable'
import { LoadableValue } from '../redux'

export interface User {
  id: number
  preferredName: string
  bio: string
  images: string[]
}

export interface Match {
  conversation_uuid: string
  createdAt: string
  id: number
  unmatched: boolean
}

export interface SwipeState {
  allUsers: LoadableValue<List<User>>
}
