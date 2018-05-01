import { PostEndpoint } from './Endpoint'

interface Request {
}

interface Response {
}

export const logout = new PostEndpoint<Request, Response>('/users/logout', true)
