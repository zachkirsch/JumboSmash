export interface Credentials {
  username: string
  password: string
}

export interface AuthState {
  isLoggedIn: boolean
  username: string
  session: string
  errorMessage: string
}
