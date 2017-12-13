import { Platform } from 'react-native'
import { getEmail, getSessionKey } from '../../auth'
import { ErrorResponse } from '../api'

const SERVER = 'http://' + (Platform.OS === 'ios' ? '127.0.0.1' : '10.0.2.2') + ':5000'

type HttpMethod = 'GET' | 'POST'

interface IndexableMap {
  [key: string]: string | number | boolean
}

export type HttpGetRequestParams = IndexableMap

interface Token extends IndexableMap {
  email: string
  session_key: string
}

const getToken = (): Token => ({
  email: getEmail(),
  session_key: getSessionKey(),
})

abstract class Endpoint<REQ, SUCC_RESP> {

  constructor(readonly endpoint: string, readonly requiresToken: boolean) { }

  public abstract hit(body: REQ): Promise<SUCC_RESP>

  protected makeRequest(endpoint: string, method: HttpMethod, body?: REQ): Promise<SUCC_RESP> {
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

  private buildRequest(method: HttpMethod, body?: REQ): RequestInit {

    const request: RequestInit = {
      method,
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }

    if (method === 'POST') {
      if (this.requiresToken) {
        const bodyWithAuth = Object.assign({}, body, getToken())
        request.body = JSON.stringify(bodyWithAuth)
      } else {
        request.body = JSON.stringify(body || {})
      }
    }

    return request
  }

}

export class GetEndpoint<REQ extends HttpGetRequestParams, SUCC_RESP> extends Endpoint<REQ, SUCC_RESP> {
  public hit(params: REQ) {
    const uri = this.constructUriWithParams(params)
    return this.makeRequest(uri, 'GET')
  }

  private constructUriWithParams = (givenParams?: REQ) => {
    if (givenParams === undefined && !this.requiresToken) {
      return this.endpoint
    }

    let uri = this.endpoint + '?'

    if (givenParams !== undefined) {
      uri += this.getQueryString(givenParams)
    }

    if (this.requiresToken) {
      uri += this.getQueryString(getToken())
    }

    return uri
  }

  private getQueryString(params: HttpGetRequestParams) {
    const queryParams: string[] = []
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        queryParams.push(encodeURI(key) + '=' + encodeURI(params[key].toString()))
      }
    }
    return queryParams.join('&')
  }
}

export class PostEndpoint<REQ, SUCC_RESP> extends Endpoint<REQ, SUCC_RESP> {
  public hit(body: REQ) {
    return this.makeRequest(this.endpoint, 'POST', body)
  }
}
