import { PostEndpoint } from './Endpoint'

interface Request {
  email: string
}

interface Response {
  email: string
  new_user: boolean
  message: 'email_sent'
}

export const requestVerification = new PostEndpoint<Request, Response>('/users/request_verification', false)
export type RequestVerificationResponse = Response
