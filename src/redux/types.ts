import { AuthState } from '../services/auth'
import { CoCState } from '../services/coc'
import { ReduxState } from '../services/redux'
import { FirebaseState } from '../services/firebase'
import { ProfileState } from '../services/profile'
import { MatchesState } from '../services/matches'
import { SwipeState } from '../services/swipe'

export interface RootState {
  auth: AuthState
  coc: CoCState
  redux: ReduxState
  firebase: FirebaseState
  profile: ProfileState
  matches: MatchesState
  swipe: SwipeState
}
