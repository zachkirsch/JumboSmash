import { GetEndpoint, HttpGetRequest } from './Endpoint'

interface Request extends HttpGetRequest {
}

interface Response {
  users: {id: number}[]
}

export const getSwipableUsers = new GetEndpoint<Request, Response>('/users/swipable', true)
export type GetSwipableUsersResponse = Response
