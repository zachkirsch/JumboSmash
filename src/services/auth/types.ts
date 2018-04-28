export interface Credentials {
  email: string
}

export interface AuthState {
  isLoggedIn: boolean
  isNewUser: boolean
  email: string
  sessionKey: string
  validVerificationCode: boolean
  errorMessage: string
  waitingForRequestVerificationResponse: boolean
  waitingForVerificationResponse: boolean
  tutorialFinished: boolean
  codeOfConductAccepted: boolean
  nearTufts: boolean
}
