import { AuthState } from '../services/auth'
import { CoCState } from '../services/coc'

export interface RootState {
  auth: AuthState
  coc: CoCState
}
