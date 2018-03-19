import { GetEndpoint } from './Endpoint'
import { Match } from '../../matches'

type Request = {
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
