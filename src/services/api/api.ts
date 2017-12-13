import { Credentials } from '../auth'
import * as Endpoints from './endpoints'
import { getEmail } from '../auth'

export interface ErrorResponse {
  message: string
}

export const api = {
  requestVerification: (credentials: Credentials) => {
    return Endpoints.requestVerification.hit(credentials)
  },
  verifyEmail: (code: string) => {
    const email = getEmail()
    return Endpoints.verifyEmail.hit({email, code})
  },
  acceptCoC: () => {
    return Endpoints.acceptCoC.hit({})
  },
  getUserInfo: () => {
    return Endpoints.getUserInfo.hit({})
  },
}
