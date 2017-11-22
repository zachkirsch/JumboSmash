import { Credentials } from '../auth'
import {
  ApiLoginResponse,
  ApiVerifyEmailResponse,
  ApiAcceptCoCResponse,
} from './types'

const api = {
  login: (credentials: Credentials): ApiLoginResponse => {
    if (credentials.email.toLowerCase() === 'fakeuser@tufts.edu') {
      return Promise.resolve({})
    } else {
      return Promise.reject({errorMessage: 'Bad email'})
    }
  },
  verifyEmail: (verificationCode: string): ApiVerifyEmailResponse => {
    if (verificationCode === '123456') {
      return Promise.resolve({sessionKey: '143', acceptedCoC: false})
    } else {
      return Promise.reject({errorMessage: 'Bad code'})
    }
  },
  acceptCoC: (): ApiAcceptCoCResponse => {
    // TODO: check actual email
    return Promise.resolve({}) // update user's code of conduct bool here
  },
}

export * from './types'
export default api
