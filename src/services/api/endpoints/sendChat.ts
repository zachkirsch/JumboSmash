import { PostEndpoint } from './Endpoint'

interface Request {
  to_users: number[]
  message: string
}

interface Response {

}

export const sendChat = new PostEndpoint<Request, Response>('/chats/sent', true)
