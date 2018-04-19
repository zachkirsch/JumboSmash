import { Match } from '../../swipe'
import { GetEndpoint, HttpGetRequest } from './Endpoint'
import { GetUserResponse } from './GetUser'

interface Request extends HttpGetRequest {
}

interface Tag {
  id: number
  text: string
}

interface Response extends GetUserResponse {
  active_matches: Match[]
  firebase_token: string
  full_name: string
  tags: Tag[]
  uuid: string
  verified: boolean
}

export const me = new GetEndpoint<Request, Response>('/users/me', true)
export type MeResponse = Response
