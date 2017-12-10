import { PostEndpoint } from './endpoint'

interface Request {
}

interface Response {
  email: string
  accepted_coc: boolean
}

export const acceptCoc = new PostEndpoint<Request, Response>('/users/accept_coc', true)
export interface AcceptCoCRequest extends Request { }
export interface AcceptCoCResponse extends Response { }
