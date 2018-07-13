import { GetEndpoint, HttpGetRequest } from './Endpoint'

interface Request extends HttpGetRequest {
}

interface BucketListItem {
  cat_id: number
  cat_text: string
  item_id: number
  item_text: string
}

interface BucketListCategory {
  cat_text: string
  items: BucketListItem[]
}

type Response = BucketListCategory[]

export const getBucketList = new GetEndpoint<Request, Response>('/bucket_list_items', true)
export type GetBucketListResponse = Response
