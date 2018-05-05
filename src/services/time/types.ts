import { LoadableValue } from '../redux'

export interface TimeState {
  serverTime: LoadableValue<number | undefined>
  releaseDate: number
  postRelease: boolean
  postRelease2: boolean
}
