import { PostEndpoint } from './Endpoint'

interface Request {
  match_id_to_unmatch: number
}

interface Response {
}

export const unmatch = new PostEndpoint<Request, Response>('/users/unmatch', true)
