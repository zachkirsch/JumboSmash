import { GetEndpoint, HttpGetRequest } from './Endpoint'

interface Request extends HttpGetRequest {
}

interface Tag {
  cat_id: number
  cat_text: string
  tag_id: number
  tag_text: string
  tag_type: 'text' | 'emoji'
}

interface TagCategory {
  cat_text: string
  tags: Tag[]
}

type Response = TagCategory[]

export const getTags = new GetEndpoint<Request, Response>('/tags', true)
export type GetTagsResponse = Response
