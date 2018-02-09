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

// Errors

export enum AuthError {
  NO_ERROR,
  NOT_SENIOR,
  BAD_CODE,
  SERVER_ERROR,
}

export const getAuthErrorFromMessage = (errorMessage: string): AuthError => {
  switch (errorMessage) {
    case '':
      return AuthError.NO_ERROR
    case 'not_senior':
      return AuthError.NOT_SENIOR
    case 'bad_code':
      return AuthError.BAD_CODE
    default:
      return AuthError.SERVER_ERROR
  }
}
