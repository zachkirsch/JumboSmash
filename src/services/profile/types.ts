import { LoadableValue } from '../redux'

export interface ProfileState {
  preferredName: LoadableValue<string>
  major: LoadableValue<string>
  bio: LoadableValue<string>
  images: LoadableValue<string[]>
  tags: LoadableValue<string[]>
}
