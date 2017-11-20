import { Credentials } from '../auth'

export interface ApiFailureResponse {
  errorMessage: string
}

const api = {
  login: (credentials: Credentials) => {
    if (credentials.email.toLowerCase() === 'fakeuser@tufts.edu') {
      return Promise.resolve()
    } else {
      return Promise.reject({errorMessage: 'Bad email'})
    }
  },
  verifyEmail: (verificationCode: string) => {
    if (verificationCode === '123456') {
      return Promise.resolve({sessionKey: '143'})
    } else {
      return Promise.reject({errorMessage: 'Bad code'})
    }
  },
}

export default api
