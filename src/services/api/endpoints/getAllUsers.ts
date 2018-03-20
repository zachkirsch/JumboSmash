import { GetEndpoint } from './Endpoint'
import { GetUserResponse } from './getUser'

type Request = {
}

interface Response {
  users: {
    0: GetUserResponse[]
  }
}

export const getAllUsers = new GetEndpoint<Request, Response>('/users', true)
export type GetAllUsersResponse = Response
