import { GetEndpoint, HttpGetRequest } from './Endpoint'

interface Request extends HttpGetRequest {
}

interface Event {
  id: number
  name: string
  location: string
  start_at: string
}

type Response = Event[]

export const getEvents = new GetEndpoint<Request, Response>('/events', true)
export type GetEventsResponse = Response
