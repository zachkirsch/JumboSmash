import { PostEndpoint } from './Endpoint'

interface PathExtensionComponents {
  direction: 'left' | 'right'
  onUser: number
}

const constructUri = (endpoint: string, pathExtensionComponents: PathExtensionComponents) => {
  return [endpoint, pathExtensionComponents.direction, pathExtensionComponents.onUser].join('/')
}

interface Request {
}

interface Response {

}

export const swipe = new PostEndpoint<Request, Response, PathExtensionComponents>('/swipe', true, constructUri)
export type SwipePathExtensionComponents = PathExtensionComponents
export type SwipeResponse = Response
