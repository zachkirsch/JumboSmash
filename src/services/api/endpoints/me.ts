import { GetEndpoint } from './Endpoint'

type Request = {
}

interface Response {
  accepted_coc: boolean
  bio: string
  email: string
  firebase_token: string
  id: number
  preferred_name: string | null
  verified: boolean
}

export const me = new GetEndpoint<Request, Response>('/users/me', true)
export type MeResponse = Response
