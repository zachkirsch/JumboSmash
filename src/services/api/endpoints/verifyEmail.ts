import { GetEndpoint } from './endpoint'

export interface Response {
  email: string
  session_key: string
}

export const verifyEmail = new GetEndpoint<Response>('/users/verify', false)
export interface VerifyEmailResponse extends Response { }
