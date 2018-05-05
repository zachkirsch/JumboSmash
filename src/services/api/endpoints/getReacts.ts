import { GetEndpoint, HttpGetRequest } from './Endpoint'

interface Request extends HttpGetRequest {
}

interface React {
  id: number
  text: string
  type: 'emoji' | 'image'
}

type Response = React[]

export const getReacts = new GetEndpoint<Request, Response>('/reacts', true)
export type GetReactsResponse = Response
