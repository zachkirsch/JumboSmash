import { PostEndpoint } from './Endpoint'

interface Request {
  firebase_notification_token: string
}

interface Response {
}

export const setFirebaseNotificationToken = new PostEndpoint<Request, Response>('/users/set_firebase_notification_token', true)
