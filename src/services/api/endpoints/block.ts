import { PostEndpoint } from './Endpoint'

interface Request {
  email_to_block: string
}

interface Response {
}

export const block = new PostEndpoint<Request, Response>('/users/block', true)
