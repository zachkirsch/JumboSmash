import { List } from 'immutable'
import { LoadableValue } from '../redux'

export interface ProfileState {
  preferredName: LoadableValue<string>
  major: LoadableValue<string>
  bio: LoadableValue<string>
  images: LoadableValue<List<string>>
  tags: LoadableValue<List<string>>
}
