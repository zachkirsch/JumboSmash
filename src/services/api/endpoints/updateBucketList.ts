import { PostEndpoint } from './Endpoint'

interface Request {
  item_ids: number[]
}

interface Response {
}

export const updateBucketList = new PostEndpoint<Request, Response>('/bucket_list_items/set_complete', true)
