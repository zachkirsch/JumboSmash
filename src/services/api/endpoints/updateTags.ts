import { PostEndpoint } from './Endpoint'

interface Request {
  tag_ids: number[]
}

interface Response {
}

export const updateTags = new PostEndpoint<Request, Response>('/users/set_tags', true)
