import { PostEndpoint } from './Endpoint'

interface Request {
  preferred_name: string
}

interface Response {
}

export const updateName = new PostEndpoint<Request, Response>('/users/update_name', true)
export type UpdateNameResponse = Response
