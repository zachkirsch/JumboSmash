import { Credentials } from '../auth'
import * as Endpoints from './endpoints'

export interface ErrorResponse {
  message: string
}

export const api = {

  /* AUTH */

  requestVerification: (credentials: Credentials) => Endpoints.requestVerification.hit(credentials, {}),
  verifyEmail: (code: string, deviceId: string) => Endpoints.verifyEmail.hit({
    email: Endpoints.ApiAuthService.getToken().email,
    code,
    device_id: deviceId,
  }, {}),
  acceptCoC: () => Endpoints.acceptCoC.hit({}, {}),
  logout: () => Endpoints.logout.hit({}, {}),
  deactivate: () => Endpoints.deactivate.hit({}, {}),

  /* ME */

  setFirebaseUid: (uid: string) => Endpoints.setFirebaseUid.hit({firebase_uid: uid}, {}),
  setFirebaseNotificationToken: (token: string) => Endpoints.setFirebaseNotificationToken.hit({firebase_notification_token: token}, {}),
  me: () => Endpoints.me.hit({}, {}),
  updateBio: (bio: string) => Endpoints.updateBio.hit({bio}, {}),
  updateSeniorGoal: (seniorGoal: string) => Endpoints.updateSeniorGoal.hit({
    senior_goal: seniorGoal,
  }, {}),
  updateName: (preferredName: string) => Endpoints.updateName.hit({preferred_name: preferredName}, {}),
  updateImages: (images: string[]) => Endpoints.updateImages.hit({images}, {}),
  updateSeeUnderclassmen: (seeUnderclassmen: boolean) => Endpoints.updateSeeUnderclassmen.hit({
    see_underclassmen: seeUnderclassmen,
  }, {}),
  getTags: () => Endpoints.getTags.hit({}, {}),
  updateTags: (tagIds: number[]) => Endpoints.updateTags.hit({tag_ids: tagIds}, {}),
  getEvents: () => Endpoints.getEvents.hit({}, {}),
  updateEvents: (eventIds: number[]) => Endpoints.updateEvents.hit({
    event_ids: eventIds,
  }, {}),
  getReacts: () => Endpoints.getReacts.hit({}, {}),
  react: (onUser: number, reacts: number[]) => Endpoints.react.hit({
    react_on_id: onUser,
    react_ids: reacts,
  }, {}),
  getBucketList: () => Endpoints.getBucketList.hit({}, {}),
  updateBucketList: (items: number[]) => Endpoints.updateBucketList.hit({
    item_ids: items,
  }, {}),

  /* OTHERS */

  block: (email: string) => Endpoints.block.hit({email_to_block: email}, {}),
  unblock: (email: string) => Endpoints.unblock.hit({email_to_unblock: email}, {}),
  getAllUsers: () => Endpoints.getAllUsers.hit({}, {}),
  getSwipableUsers: () => Endpoints.getSwipableUsers.hit({}, {}),
  swipe: (direction: Endpoints.Direction, onUser: number) => Endpoints.swipe.hit({}, {direction, onUser}),
  getUser: (userId: number) => Endpoints.getUser.hit({}, {userId}),
  sendChat: (toUsers: number[], message: string, matchId: number) => Endpoints.sendChat.hit({
    to_users: toUsers,
    match_id: matchId,
    message,
  }, {}),
  unmatch: (matchId: number) => Endpoints.unmatch.hit({
    match_id_to_unmatch: matchId,
  }, {}),

  /* MISC */

  getServerTime: () => Endpoints.getServerTime.hit({}, {}),
}

// Errors

export enum AuthError {
  NO_ERROR,
  NOT_TUFTS,
  NOT_SENIOR,
  BAD_CODE,
  SERVER_ERROR,
}

export const getAuthErrorFromMessage = (errorMessage: string | undefined): AuthError => {
  switch (errorMessage) {
    case '':
    case undefined:
      return AuthError.NO_ERROR
    case 'not_senior':
      return AuthError.NOT_SENIOR
    case 'not_tufts':
      return AuthError.NOT_TUFTS
    case 'bad_code':
      return AuthError.BAD_CODE
    default:
      return AuthError.SERVER_ERROR
  }
}
