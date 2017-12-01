import { Credentials } from '../auth'
import * as ApiTypes from './types'
import { getEmail, getSessionKey } from '../auth'

const SERVER = 'http://127.0.0.1:5000'

type HTTPMethod = 'GET' | 'POST'

interface AuthParams {
  email: string
  session_key: string
}

/* returns a Partial<AuthParams> with only the params that are defined in the redux store */
function getAuthParams(): Partial<AuthParams> {

  let params: Partial<AuthParams> = {}

  // add email to params if it's defined
  const email = getEmail()
  if (email) {
    params = {
      ...params,
      email,
    }
  }

  // add session key to params if it's defined
  const sessionKey = getSessionKey()
  if (sessionKey) {
    params = {
      ...params,
      session_key: sessionKey,
    }
  }

  return params
}

function buildRequest<REQ>(method: HTTPMethod, body?: REQ): RequestInit {
  const request: RequestInit = {
    method,
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  }
  if (method === 'POST') {
    request.body = JSON.stringify(Object.assign(body || {}, getAuthParams()))
  }
  return request
}

function makeRequest<REQ, SUCC_RESP>(endpoint: string, method: HTTPMethod, body?: REQ): Promise<SUCC_RESP> {
  return fetch(SERVER + endpoint, buildRequest(method, body))
  .catch((_: TypeError) => {
    throw Error('Could not connect to the server')
  })
  .then((response) => {
    if (response.ok) {
      return response.json()
    }
    return response.json().then((errorJson: ApiTypes.ErrorResponse) => {
      throw Error(errorJson.message)
    })
  })
}

export const api = {
  requestVerification: (credentials: Credentials) => {
    type Req = ApiTypes.RequestVerificationRequest
    type Resp = ApiTypes.RequestVerificationSuccessResponse
    const endpoint = '/users/request_verification'
    return makeRequest<Req, Resp>(endpoint, 'POST', credentials)
  },
  verifyEmail: (code: string) => {
    type Req = ApiTypes.VerifyEmailRequest
    type Resp = ApiTypes.VerifyEmailSuccessResponse
    const endpoint = '/users/verify/' + code
    return makeRequest<Req, Resp>(endpoint, 'GET')
  },
  acceptCoC: () => {
    type Req = ApiTypes.AcceptCoCRequest
    type Resp = ApiTypes.AcceptCoCSuccessResponse
    const endpoint = '/users/accept_coc'
    return makeRequest<Req, Resp>(endpoint, 'POST')
  },
}
