import { Platform } from 'react-native'
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

  protected makeRequest(endpoint: string, method: HttpMethod, body: Request | undefined): Promise<SuccessResponse> {
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

  protected getPlatformParam = () => ({ platform: Platform.OS })

  private buildRequest(method: HttpMethod, body: Request | undefined): RequestInit {

    const request: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    }

    if (method === 'POST') {
      body = Object.assign(body, this.getPlatformParam())
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

    params = Object.assign(params, this.getPlatformParam())

    if (this.requiresToken) {
      params = Object.assign(params, ApiAuthService.getToken())
    }

    return endpoint + this.getQueryString(params)
  }

  private getQueryString(params: HttpGetRequest) {
    const queryParams: string[] = []
    Object.keys(params).forEach((key) => {
      if (params.hasOwnProperty(key)) {
        queryParams.push(encodeURI(key) + '=' + encodeURI(params[key].toString()))
      }
    })
    if (queryParams.length > 0) {
      return '?' + queryParams.join('&')
    } else {
      return ''
    }
  }
}

export class PostEndpoint<Request, SuccessResponse, PathExtensionComponents = {}>
       extends Endpoint<Request, SuccessResponse, PathExtensionComponents> {

  public hit(body: Request, pathExtensionComponents: PathExtensionComponents) {
    return this.makeRequest(this.getEndpoint(pathExtensionComponents), 'POST', body)
  }
}
