import { GetEndpoint, HttpGetRequest } from './Endpoint'

interface PathExtensionComponents {
  userId: number
}

const constructUri = (endpoint: string, pathExtensionComponents: PathExtensionComponents) => {
  return endpoint + '/' + pathExtensionComponents.userId
}

interface Request extends HttpGetRequest {
}

export interface ProfileReact {
  react_id: number
  react_count: number
  react_text: string
  type: 'image' | 'emoji'
}

interface Tag {
  id: number
  text: string
  type: 'text' | 'emoji'
}

interface Response {
  accepted_coc: boolean
  bio: string
  class_year: number
  email: string
  firebase_uid: string
  full_name: string
  id: number
  images: Array<{url: string}>
  major: string | null
  preferred_name: string | null
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
