import { PostEndpoint } from './Endpoint'
import { GetUserResponse } from './getUser'

export interface Match {
  conversation_uuid: string
  createdAt: string
  id: number
  unmatched: boolean
  users: GetUserResponse[]
}

export type Direction = 'left' | 'right'

interface PathExtensionComponents {
  direction: Direction
  onUser: number
}

const constructUri = (endpoint: string, pathExtensionComponents: PathExtensionComponents) => {
  return [endpoint, pathExtensionComponents.direction, pathExtensionComponents.onUser].join('/')
}

interface Request {}

type Response = { matched: false } | {
  matched: true
  match: Match
}

export const swipe = new PostEndpoint<Request, Response, PathExtensionComponents>('/swipe', true, constructUri)
export type SwipePathExtensionComponents = PathExtensionComponents
export type SwipeResponse = Response
