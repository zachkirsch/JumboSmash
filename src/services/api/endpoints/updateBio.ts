import { PostEndpoint } from './Endpoint'

interface Request {
  bio: string
}

interface Response {
}

export const updateBio = new PostEndpoint<Request, Response>('/users/update_bio', true)
export type UpdateBioResponse = Response
