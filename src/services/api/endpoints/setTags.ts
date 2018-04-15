import { PostEndpoint } from './Endpoint'

interface Request {
  tag_ids: string[]
}

interface Response {
  // TODO: add response type
}

export const setTags = new PostEndpoint<Request, Response>('/users/set_tags', true)
export type SetTagsResponse = Response
