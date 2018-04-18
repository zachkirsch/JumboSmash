import { Platform } from 'react-native'
import { Store } from 'redux'
import RNFetchBlob from 'react-native-fetch-blob'
import { RootState } from '../../../redux'
import { ErrorResponse } from '../api'

const LOCAL_SERVER = false
const SERVER = !LOCAL_SERVER ? 'https://jumbosmash2018-staging.herokuapp.com/' : Platform.select({
  ios: 'http://127.0.0.1:5000',
  android: 'http://10.0.2.2:5000',
})

type HttpMethod = 'GET' | 'POST'

export interface HttpGetRequest {
  [key: string]: string | number
}

interface Token {
  email: string
  session_key: string
}

export const TokenService = { /* tslint:disable-line:variable-name */
  setStore: (store: Store<RootState>) => this.store = store,
  getToken: (): Token => {
    if (!this.store) {
      return undefined
    } else {
      const store: Store<RootState> = this.store
      return {
        email: store.getState().auth.email,
        session_key: store.getState().auth.sessionKey,
      }
    }
  },
}

// required because wer're using RNFetchBlob
const Fetch: any = RNFetchBlob.polyfill.Fetch /* tslint:disable-line:no-any */
window.fetch = new Fetch({
    auto : true,
    binaryContentTypes : [
        'image/',
        'video/',
        'audio/',
        'foo/',
    ],
}).build()

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
      } else if (response.status >= 500) {
        throw Error('Server Error')
      } else {
        return response.json().then((errorJson: ErrorResponse) => {
          throw Error(errorJson.message)
        })
      }
    })
  }

  private buildRequest(method: HttpMethod, body?: Request): RequestInit {

    const request: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    if (method === 'POST') {
      if (this.requiresToken) {
        const bodyWithAuth = Object.assign(body, TokenService.getToken())
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
      const {email, session_key} = TokenService.getToken()
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
