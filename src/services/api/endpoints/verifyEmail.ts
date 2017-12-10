import { GetEndpoint, HttpGetRequestParams } from './Endpoint'

interface Request extends HttpGetRequestParams {
  email: string
  code: string
}

interface Response {
  email: string
  session_key: string
}

export const verifyEmail = new GetEndpoint<Request, Response>('/users/verify', false)
export interface VerifyEmailResponse extends Response { }
