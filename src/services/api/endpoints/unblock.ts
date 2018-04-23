import { PostEndpoint } from './Endpoint'

interface Request {
  email_to_unblock: string
}

interface Response {
}

export const unblock = new PostEndpoint<Request, Response>('/users/unblock', true)
