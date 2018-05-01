import { PostEndpoint } from './Endpoint'

interface Request {
  to_users: number[]
  match_id: number
  message: string
}

interface Response {

}

export const sendChat = new PostEndpoint<Request, Response>('/chats/sent', true)
