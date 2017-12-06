import { Platform } from 'react-native'
import { getEmail, getSessionKey } from '../../auth'
import { ErrorResponse } from '../api'

const SERVER = 'http://' + (Platform.OS === 'ios' ? '127.0.0.1' : '10.0.2.2') + ':5000'

type HTTPMethod = 'GET' | 'POST'

interface Token {
  email: string
  session_key: string
}

const getToken = (): Token => {
  return {
    email: getEmail(),
    session_key: getSessionKey(),
  }
}

abstract class Endpoint<REQ, SUCC_RESP> {

  constructor(readonly endpoint: string, readonly requiresToken: boolean) { }

  protected makeRequest(endpoint: string, method: HTTPMethod, body?: REQ): Promise<SUCC_RESP> {
    return fetch(SERVER + endpoint, this.buildRequest(method, body))
    .catch((_: TypeError) => {
      throw Error('Could not connect to the server')
    })
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      return response.json().then((errorJson: ErrorResponse) => {
        throw Error(errorJson.message)
      })
    })
  }

  private buildRequest(method: HTTPMethod, body: REQ): RequestInit {

    const request: RequestInit = {
      method,
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }

    if (method === 'POST') {
      if (this.requiresToken) {
        const bodyWithAuth = Object.assign(body, getToken())
        request.body = JSON.stringify(bodyWithAuth)
      } else {
        request.body = JSON.stringify(body)
      }
    }

    return request
  }
}

export class GetEndpoint<SUCC_RESP> extends Endpoint<{}, SUCC_RESP> {
  public hit(suffix?: string) {
    return this.makeRequest(suffix ? this.endpoint + '/' + suffix : this.endpoint, 'GET')
  }
}

export class PostEndpoint<REQ, SUCC_RESP> extends Endpoint<REQ, SUCC_RESP> {
  public hit(body: REQ) {
    return this.makeRequest(this.endpoint, 'POST', body)
  }
}
