import { GetEndpoint, HttpGetRequest } from './Endpoint'
import { GetUserResponse } from './getUser'

interface Request extends HttpGetRequest {
}

interface Response {
  users: {
    0: GetUserResponse[]
  }
}

export const getAllUsers = new GetEndpoint<Request, Response>('/users', true)
export type GetAllUsersResponse = Response
