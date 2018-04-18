import { PostEndpoint } from './Endpoint'

interface Request {
  firebase_uid: string
}

interface Response {
}

export const setFirebaseUid = new PostEndpoint<Request, Response>('/users/set_firebase_uid', true)
