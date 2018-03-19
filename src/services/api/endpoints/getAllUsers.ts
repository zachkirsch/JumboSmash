import { GetEndpoint } from './Endpoint'
import { User } from '../../matches'

type Request = {
}

interface Response {
  users: User[]
}

export const getAllUsers = new GetEndpoint<Request, Response>('/users', true)
export type GetAllUsersResponse = Response
