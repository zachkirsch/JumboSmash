import { GetEndpoint, HttpGetRequestParams } from './Endpoint'

interface Request extends HttpGetRequestParams {
  email: string
  code: string
}

type Response = {
  email: string
  session_key: string
}

export const verifyEmail = new GetEndpoint<Request, Response>('/users/verify', false)
export type VerifyEmailRequest = Request
export type VerifyEmailResponse = Response
