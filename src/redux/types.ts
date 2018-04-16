import { AuthState } from '../services/auth'
import { CoCState } from '../services/coc'
import { FirebaseState } from '../services/firebase'
import { MatchesState } from '../services/matches'
import { ProfileState } from '../services/profile'
import { ReduxState } from '../services/redux'
import { SwipeState } from '../services/swipe'
import { NavigationState } from '../services/navigation'
import { TutorialState } from '../services/tutorial'

export interface RootState {
  auth: AuthState
  coc: CoCState
  tutorial: TutorialState
  redux: ReduxState
  firebase: FirebaseState
  profile: ProfileState
  matches: MatchesState
  swipe: SwipeState
  navigation: NavigationState
}
