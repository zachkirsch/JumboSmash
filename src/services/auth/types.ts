export interface Credentials {
  email: string
}

export interface AuthState {
  isNewUser: boolean
  email: string
  sessionKey: string
  validVerificationCode: boolean
  errorMessage: string
  waitingForRequestVerificationResponse: boolean
  waitingForVerificationResponse: boolean
}
