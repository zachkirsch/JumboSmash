import { GetEndpoint } from './Endpoint'

interface PathExtensionComponents {
  userId: number
}

const constructUri = (endpoint: string, pathExtensionComponents: PathExtensionComponents) => {
  return endpoint + '/' + pathExtensionComponents.userId
}

type Request = {
}

interface Response {
  id: number
  email: string
  preferred_name?: string
  bio: string
  images: {url: string}[]
}

export const getUser = new GetEndpoint<Request, Response, PathExtensionComponents>(
  '/users',
  true,
  constructUri)
export type GetUserPathExtensionComponents = PathExtensionComponents
export type GetUserResponse = Response
