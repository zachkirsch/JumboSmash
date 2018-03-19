import { GetEndpoint } from './Endpoint'

type Request = {
}

interface ActiveMatch {
  conversation_uuid: string
  createdAt: string
  id: number
  unmatched: boolean
}

interface Image {
  url: string
}

interface Response {
  accepted_coc: boolean
  active_matches: ActiveMatch[]
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
