import { List, Map } from 'immutable'
import { LoadableValue } from '../redux'
import { ProfileReact } from '../profile'

interface Tag {
  name: string
  emoji: boolean
}

export interface User {
  id: number
  firebaseUid: string
  email: string
  preferredName: string
  surname: string
  fullName: string
  classYear: number
  seniorGoal: string
  bio: string
  images: string[]
  profileReacts: LoadableValue<ProfileReact[]>
  tags: Tag[]
  events: number[]
}

export interface SwipeState {
  allUsers: LoadableValue<Map<number, User>>
  swipableUsers: LoadableValue<List<number>>
  indexOfUserOnTop: number
}
