import { PostEndpoint } from './Endpoint'

type Request = {
  email: string
}

type Response = {
  email: string
  new_user: boolean
  message: 'email_sent'
}

export const requestVerification = new PostEndpoint<Request, Response>('/users/request_verification', false)
export type RequestVerificationRequest = Request
export type RequestVerificationResponse = Response
