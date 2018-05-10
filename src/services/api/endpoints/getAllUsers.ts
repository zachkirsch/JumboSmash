import { GetEndpoint, HttpGetRequest } from './Endpoint'
import { GetUserResponse } from './getUser'

interface Request extends HttpGetRequest {
}

export interface IndividualProfileReact {
  id: number
  react_id: number
  user_from_id: number
  user_on_id: number
}

export interface GetAllUsersUser extends GetUserResponse {
  my_reacts: IndividualProfileReact[]
}

interface Response {
  users: GetAllUsersUser[]
}

export const getAllUsers = new GetEndpoint<Request, Response>('/users', true)
export type GetAllUsersResponse = Response
