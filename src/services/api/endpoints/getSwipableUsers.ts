import { PostEndpoint } from './Endpoint'
import { GetUserResponse } from './getUser'

interface Request {
}

interface Response {
  users: GetUserResponse[]
}

export const getSwipableUsers = new PostEndpoint<Request, Response>('/users/swipable', true)
export type GetSwipableUsersResponse = Response
