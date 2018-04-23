import { GetEndpoint, HttpGetRequest } from './Endpoint'

interface PathExtensionComponents {
  userId: number
}

const constructUri = (endpoint: string, pathExtensionComponents: PathExtensionComponents) => {
  return endpoint + '/' + pathExtensionComponents.userId
}

interface Request extends HttpGetRequest {
}

interface ProfileReact {
  react_id: number
  react_count: number
  react_text: string
}

interface Tag {
  id: number
  text: string
}

interface Response {
  accepted_coc: boolean
  bio: string
  email: string
  firebase_uid: string
  full_name: string
  id: number
  images: Array<{url: string}>
  major: string
  preferred_name: string
  profile_reacts: ProfileReact[]
  surname: string
  tags: Tag[]
  uuid: string
  verified: boolean
}

export const getUser = new GetEndpoint<Request, Response, PathExtensionComponents>(
  '/users',
  true,
  constructUri)
export type GetUserPathExtensionComponents = PathExtensionComponents
export type GetUserResponse = Response
