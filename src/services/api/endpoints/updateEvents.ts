import { PostEndpoint } from './Endpoint'

interface Request {
  event_ids: number[]
}

interface Response {
}

export const updateEvents = new PostEndpoint<Request, Response>('/events/set_attendance', true)
