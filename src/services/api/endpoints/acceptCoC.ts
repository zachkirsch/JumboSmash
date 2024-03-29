import { PostEndpoint } from './Endpoint'

interface Request {
}

interface Response {
  email: string
  accepted_coc: boolean
}

export const acceptCoC = new PostEndpoint<Request, Response>('/users/accept_coc', true)
export type AcceptCoCResponse = Response
