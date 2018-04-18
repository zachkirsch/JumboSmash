import { Credentials } from '../auth'
import * as Endpoints from './endpoints'

export interface ErrorResponse {
  message: string
}

export const api = {

  /* LOGIN */

  requestVerification: (credentials: Credentials) => Endpoints.requestVerification.hit(credentials, {}),
  verifyEmail: (code: string) => Endpoints.verifyEmail.hit({email: Endpoints.TokenService.getToken().email, code}, {}),
  acceptCoC: () => Endpoints.acceptCoC.hit({}, {}),

  /* ME */

  setFirebaseUid: (uid: string) => Endpoints.setFirebaseUid.hit({firebase_uid: uid}, {}),
  setFirebaseNotificationToken: (token: string) => Endpoints.setFirebaseNotificationToken.hit({firebase_notification_token: token}, {}),

  me: () => Endpoints.me.hit({}, {}),
  updateBio: (bio: string) => Endpoints.updateBio.hit({bio}, {}),
  updateName: (preferredName: string) => Endpoints.updateName.hit({preferred_name: preferredName}, {}),
  updateImages: (images: string[]) => Endpoints.updateImages.hit({images}, {}),
  getTags: () => Endpoints.getTags.hit({}, {}),
  setTags: (tagIds: string[]) => Endpoints.setTags.hit({tag_ids: tagIds}, {}),

  /* OTHERS */

  getAllUsers: () => Endpoints.getAllUsers.hit({}, {}),
  getSwipableUsers: () => Endpoints.getSwipableUsers.hit({}, {}),
  swipe: (direction: Endpoints.Direction, onUser: number) => Endpoints.swipe.hit({}, {direction, onUser}),
  getUser: (userId: number) => Endpoints.getUser.hit({}, {userId}),
  sendChat: (toUsers: number[], message: string) => Endpoints.sendChat.hit({
    to_users: toUsers,
    message,
  }, {}),

}

// Errors

export enum AuthError {
  NO_ERROR,
  NOT_SENIOR,
  BAD_CODE,
  SERVER_ERROR,
}

export const getAuthErrorFromMessage = (errorMessage: string): AuthError => {
  switch (errorMessage) {
    case '':
      return AuthError.NO_ERROR
    case 'not_senior':
      return AuthError.NOT_SENIOR
    case 'bad_code':
      return AuthError.BAD_CODE
    default:
      return AuthError.SERVER_ERROR
  }
}
