import { PostEndpoint } from './Endpoint'

interface Request {
  tag_ids: string[]
}

interface Response {
  tags: any
}

export const setTags = new PostEndpoint<Request, Response>('/users/set_tags', true)
