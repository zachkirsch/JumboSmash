import { Credentials } from '../auth'

export interface ApiLoginSuccessResponse {
  sessionKey: string
}

export interface ApiLoginFailureResponse {
  errorMessage: string
}

export default {
  login: (credentials: Credentials) => {
    if (credentials.username.toLowerCase() === 'fakeuser' &&
        credentials.password === 'password') {
      return Promise.resolve({sessionKey: '143'})
    } else {
      return Promise.reject({errorMessage: 'Error logging in'})
    }
  }
}
