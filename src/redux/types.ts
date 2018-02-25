import { AuthState } from '../services/auth'
import { CoCState } from '../services/coc'
import { ReduxState } from '../services/redux'

export interface RootState {
  auth: AuthState
  coc: CoCState
  redux: ReduxState
}
