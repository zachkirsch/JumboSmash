import { ErrorResponse } from '../api'
import { ApiAuthService } from './utils'
import { SERVER_URL } from '../../../globals'

type HttpMethod = 'GET' | 'POST'

export interface HttpGetRequest {
  [key: string]: string | number
}

abstract class Endpoint<Request, SuccessResponse, PathExtensionComponents> {

  constructor(readonly endpoint: string,
              readonly requiresToken: boolean,
              readonly constructUri?: (endpoint: string, components: PathExtensionComponents) => string) { }

  protected getEndpoint = (pathExtensionComponents: PathExtensionComponents) => {
    return this.constructUri ? this.constructUri(this.endpoint, pathExtensionComponents) : this.endpoint
  }

  // TODO: retry failed requests
  // TODO: logout if banned
  protected makeRequest(endpoint: string, method: HttpMethod, body: Request | undefined, retry = true): Promise<SuccessResponse> {
    return fetch(SERVER_URL.replace(/\/$/, '') + endpoint, this.buildRequest(method, body))
    .catch((_: TypeError) => {
      throw Error('Could not connect to the server')
    })
    .then((response) => {
      if (!ApiAuthService.isLoggedIn && this.requiresToken) {
        return
      } else if (response.ok) {
        return response.json()
      } else if (response.status >= 500) {
        throw Error('Server Error')
      } else if (ApiAuthService.isLoggedIn() && response.status === 401) {
        ApiAuthService.logout()
        return
      } else {
        return response.json().then((errorJson: ErrorResponse) => {
          throw Error(errorJson.message)
        })
      }
    })
  }

  private buildRequest(method: HttpMethod, body: Request | undefined): RequestInit {

    const request: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    }

    if (method === 'POST') {
      if (this.requiresToken) {
        const bodyWithAuth = Object.assign(body, ApiAuthService.getToken())
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
    return this.makeRequest(uri, 'GET', undefined)
  }

  private constructUriWithParams = (params: Request, pathExtensionComponents: PathExtensionComponents) => {

    const endpoint = this.getEndpoint(pathExtensionComponents)

    if (params === undefined && !this.requiresToken) {
      return endpoint
    }

    let uri = endpoint + '?'

    if (this.requiresToken) {
      uri += this.getQueryString({...ApiAuthService.getToken()})
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
