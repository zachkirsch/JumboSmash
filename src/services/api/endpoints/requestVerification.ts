import { PostEndpoint } from './endpoint'

interface Request {
  email: string
}

interface Response {
  email: string
  new_user: boolean
  message: 'email_sent'
}

export const requestVerification = new PostEndpoint<Request, Response>('/users/request_verification', false)
export interface RequestVerificationRequest extends Request { }
export interface RequestVerificationResponse extends Response { }
