import { GetEndpoint, HttpGetRequestParams } from './Endpoint'

interface Request extends HttpGetRequestParams {
}

type Response = {
  accepted_coc: boolean
  email: string
  id: number
  is_senior?: boolean
  preferred_name?: string
  verified: boolean
}

export const getUserInfo = new GetEndpoint<Request, Response>('/users/me', true)
export type GetUserInfoResponse = Response
