import { Credentials } from '../auth'
import * as Endpoints from './endpoints'

export interface ErrorResponse {
  message: string
}

export const api = {
  requestVerification: (credentials: Credentials) => {
    return Endpoints.requestVerification.hit(credentials)
  },
  verifyEmail: (code: string) => {
    return Endpoints.verifyEmail.hit(code)
  },
  acceptCoC: () => {
    return Endpoints.acceptCoc.hit({})
  },
}
