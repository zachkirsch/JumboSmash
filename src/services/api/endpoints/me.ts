import { GetEndpoint, HttpGetRequest } from './Endpoint'
import { GetUserResponse } from './getUser'
import { IndividualProfileReact } from './getAllUsers'
import { Match } from './swipe'

interface Request extends HttpGetRequest {
}

interface Response extends GetUserResponse {
  active_matches: Match[]
  blocked_users: string[]
  firebase_token: string
  full_name: string
  uuid: string
  verified: boolean
  who_reacted: IndividualProfileReact[]
}

export const me = new GetEndpoint<Request, Response>('/users/me', true)
export type MeResponse = Response
