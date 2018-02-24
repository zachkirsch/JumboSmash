export interface Credentials {
  email: string
}

export interface AuthState {
  isLoggedIn: boolean
  isNewUser: boolean
  email: string
  sessionKey: string
  validEmail: boolean
  validVerificationCode: boolean
  errorMessage: string
  waitingForRequestVerificationResponse: boolean
  waitingForVerificationResponse: boolean
}
