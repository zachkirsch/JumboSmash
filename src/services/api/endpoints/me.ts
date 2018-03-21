import { Match } from '../../swipe'
import { GetEndpoint, HttpGetRequest } from './Endpoint'

interface Request extends HttpGetRequest {
}

interface Image {
  url: string
}

interface Response {
  accepted_coc: boolean
  active_matches: Match[]
  bio: string
  email: string
  firebase_token: string
  id: number
  images: Image[]
  preferred_name: string | null
  verified: boolean
}

export const me = new GetEndpoint<Request, Response>('/users/me', true)
export type MeResponse = Response
