import { GetEndpoint, HttpGetRequest } from './Endpoint'
import { GetUserResponse } from './getUser'

interface Request extends HttpGetRequest {
}

interface Response {
  users: GetUserResponse[]
}

export const getSwipableUsers = new GetEndpoint<Request, Response>('/users/swipable', true)
export type GetSwipableUsersResponse = Response
