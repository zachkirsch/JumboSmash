import { GetEndpoint, HttpGetRequest } from './Endpoint'

interface Request extends HttpGetRequest {
}

interface Response {
  // TODO: add response type
}

export const getTags = new GetEndpoint<Request, Response>('/tags', true)
export type GetTagsResponse = Response
