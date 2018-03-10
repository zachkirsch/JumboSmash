import { GetEndpoint } from './Endpoint'

type Request = {
  email: string
  code: string
}

interface Response {
  email: string
  session_key: string
}

export const verifyEmail = new GetEndpoint<Request, Response>('/users/verify', false)
export type VerifyEmailResponse = Response
