export interface Credentials {
  email: string
}

export interface AuthState {
  isLoggedIn: boolean
  email: string
  sessionKey: string
  validEmail: boolean
  validVerificationCode: boolean
  errorMessage: string
}
