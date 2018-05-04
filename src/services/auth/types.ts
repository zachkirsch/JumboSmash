import { LoadableValue } from '../redux'

export interface Credentials {
  email: string
}

export interface AuthState {
  loggedIn: LoadableValue<boolean>
  verified: LoadableValue<boolean>
  isNewUser: boolean
  email: string
  sessionKey: string
  waitingForRequestVerificationResponse: boolean
  tutorialFinished: boolean
  codeOfConductAccepted: boolean
  nearTufts: boolean
  deviceId: string
}
