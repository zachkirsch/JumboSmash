import { PostEndpoint } from './Endpoint'

interface Request {
  see_underclassmen: boolean
}

interface Response {
}

export const updateSeeUnderclassmen = new PostEndpoint<Request, Response>('/users/update_see_underclassmen', true)
