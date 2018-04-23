import { PostEndpoint } from './Endpoint'

interface Request {
  react_on_id: number
  react_ids: number[]
}

interface Response {
}

export const react = new PostEndpoint<Request, Response>('/users/set_reacts', true)
