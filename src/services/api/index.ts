import { Credentials } from '../auth'

export interface ApiLoginSuccessResponse {
  sessionKey: string
}

export interface ApiLoginFailureResponse {
  errorMessage: string
}

const api = {
  login: (credentials: Credentials) => {
    if (credentials.email.toLowerCase() === 'fakeuser@tufts.edu') {
      return Promise.resolve({sessionKey: '143'})
    } else {
      return Promise.reject({errorMessage: 'Error logging in'})
    }
  }
}

export default api
