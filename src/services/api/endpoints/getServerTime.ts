import { GetEndpoint, HttpGetRequest } from './Endpoint'

interface Request extends HttpGetRequest {
}

interface Response {
  time: string
  release_date: string
  post_release: boolean
  post_release_2: boolean
}

export const getServerTime = new GetEndpoint<Request, Response>('/time', false)
export type GetServerTimeResponse = Response
