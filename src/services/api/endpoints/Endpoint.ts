import { getEmail, getSessionKey } from '../../auth'
import { ErrorResponse } from '../api'

const SERVER = 'http://10.0.2.2:5000'
// const SERVER = 'https://jumbosmash2018-staging.herokuapp.com/'
// const SERVER = 'http://127.0.0.1:5000/'

type HttpMethod = 'GET' | 'POST'

type HttpGetRequest = {
  [key: string]: string | number
}

interface Token {
  email: string
  session_key: string
}

const getToken = (): Token => ({
  email: getEmail(),
  session_key: getSessionKey(),
})

abstract class Endpoint<Request, SuccessResponse, PathExtensionComponents> {

  constructor(readonly endpoint: string,
              readonly requiresToken: boolean,
              readonly constructUri?: (endpoint: string, components: PathExtensionComponents) => string) { }

  protected getEndpoint = (pathExtensionComponents: PathExtensionComponents) => {
    return this.constructUri ? this.constructUri(this.endpoint, pathExtensionComponents) : this.endpoint
  }

  protected makeRequest(endpoint: string, method: HttpMethod, body?: Request): Promise<SuccessResponse> {
    return fetch(SERVER.replace(/\/$/, '') + endpoint, this.buildRequest(method, body))
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

  private buildRequest(method: HttpMethod, body?: Request): RequestInit {

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

export class GetEndpoint<Request extends HttpGetRequest, SuccessResponse, PathExtensionComponents = {}>
       extends Endpoint<Request, SuccessResponse, PathExtensionComponents> {

  public hit(params: Request, pathExtensionComponents: PathExtensionComponents) {
    const uri = this.constructUriWithParams(params, pathExtensionComponents)
    return this.makeRequest(uri, 'GET')
  }

  private constructUriWithParams = (params: Request, pathExtensionComponents: PathExtensionComponents) => {

    const endpoint = this.getEndpoint(pathExtensionComponents)

    if (params === undefined && !this.requiresToken) {
      return endpoint
    }

    let uri = endpoint + '?'

    if (this.requiresToken) {
      const {email, session_key} = getToken()
      uri += this.getQueryString({email, session_key})
    }

    if (params) {
      uri += this.getQueryString(params)
    }

    return uri
  }

  private getQueryString(params: HttpGetRequest) {
    const queryParams: string[] = []
    Object.keys(params).forEach((key) => {
      if (params.hasOwnProperty(key)) {
        queryParams.push(encodeURI(key) + '=' + encodeURI(params[key].toString()))
      }
    })
    return queryParams.join('&')
  }
}

export class PostEndpoint<Request, SuccessResponse, PathExtensionComponents = {}>
       extends Endpoint<Request, SuccessResponse, PathExtensionComponents> {

  public hit(body: Request, pathExtensionComponents: PathExtensionComponents) {
    return this.makeRequest(this.getEndpoint(pathExtensionComponents), 'POST', body)
  }
}
