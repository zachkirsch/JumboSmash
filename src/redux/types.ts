import { AuthState } from '../services/auth'
import { FirebaseState } from '../services/firebase'
import { MatchesState } from '../services/matches'
import { ProfileState } from '../services/profile'
import { ReduxState } from '../services/redux'
import { SwipeState } from '../services/swipe'
import { NavigationState } from '../services/navigation'
import { NotificationsState } from '../services/notifications'
import { TimeState } from '../services/time'

export interface RootState {
  auth: AuthState
  redux: ReduxState
  firebase: FirebaseState
  profile: ProfileState
  matches: MatchesState
  swipe: SwipeState
  navigation: NavigationState
  notifications: NotificationsState
  time: TimeState,
}
