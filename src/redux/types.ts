import { AuthState } from '../services/auth'
import { CoCState } from '../services/coc'
import { ReduxState } from '../services/redux'
import { FirebaseState } from '../services/firebase'

export interface RootState {
  auth: AuthState
  coc: CoCState
  redux: ReduxState
  firebase: FirebaseState
}
