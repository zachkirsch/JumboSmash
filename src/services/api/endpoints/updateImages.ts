import { PostEndpoint } from './Endpoint'

interface Request {
  images: string[]
}

interface Response {
}

export const updateImages = new PostEndpoint<Request, Response>('/users/update_images', true)
export type UpdateImagesResponse = Response
