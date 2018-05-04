import { GetEndpoint, HttpGetRequest } from './Endpoint'

interface Request extends HttpGetRequest {
  email: string
  code: string
  device_id: string
}

interface Response {
  email: string
  session_key: string
  firebase_token: string
  class_year: number
}

export const verifyEmail = new GetEndpoint<Request, Response>('/users/verify', false)
export type VerifyEmailResponse = Response
