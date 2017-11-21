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
      return Promise.resolve({sessionKey: '143', acceptedCoC: false})
    } else {
      return Promise.reject({errorMessage: 'Bad code'})
    }
  },
  acceptCoC: () => {
    // TODO: check actual email
    return Promise.resolve() // update user's code of conduct bool here
  },
}

export default api
