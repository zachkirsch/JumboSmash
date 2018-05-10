import { GetEndpoint, HttpGetRequest } from './Endpoint'

interface Request extends HttpGetRequest {
}

export interface EventRSVP {
  event_id: number
  attendee_id: number
  going: boolean
}

interface EventWithRSVPs {
  event_id: number
  attendees: EventRSVP[]
}

type Response = EventWithRSVPs[]

export const getEventRSVPs = new GetEndpoint<Request, Response>('/event_responses', true)
export type GetEventRSVPsResponse = Response
