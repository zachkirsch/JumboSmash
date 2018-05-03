import { PostEndpoint } from './Endpoint'

interface Request {
}

interface Response {
}

export const deactivate = new PostEndpoint<Request, Response>('/users/deactivate', true)
