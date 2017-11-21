export interface Credentials {
  email: string
}

export interface AuthState {
  isLoggedIn: boolean
  email: string
  session: string
  validEmail: boolean
  validVerificationCode: boolean
  errorMessage: string
}
