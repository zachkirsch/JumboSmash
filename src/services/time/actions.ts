/* Actions */

export enum TimeActionType {
  ATTEMPT_GET_SERVER_TIME = 'ATTEMPT_GET_SERVER_TIME',
  GET_SERVER_TIME_SUCCESS = 'GET_SERVER_TIME_SUCCESS',
  GET_SERVER_TIME_FAILURE = 'GET_SERVER_TIME_FAILURE',
  OTHER_ACTION = '__any_other_action_type__',
}

export interface AttempGetServerTimeAction {
  type: TimeActionType.ATTEMPT_GET_SERVER_TIME
}

export interface GetServerTimeSuccessAction {
  type: TimeActionType.GET_SERVER_TIME_SUCCESS
  serverTime: number
  releaseDate: number
  postRelease: boolean
  postRelease2: boolean
}

export interface GetServerTimeFailureAction {
  type: TimeActionType.GET_SERVER_TIME_FAILURE
  errorMessage: string
}

/* the point of the OtherAction action is for TypeScript to warn us if we don't
 * have a default case when processing actions. We will never dispatch
 * OtherAction, but we do need a default case for the other Actions that are
 * dispatched (by third-party plugins and Redux itself). For more information,
 * see https://spin.atomicobject.com/2017/07/24/redux-action-pattern-typescript/
 */

export interface OtherAction {
  type: TimeActionType.OTHER_ACTION
}

export type TimeAction =
  AttempGetServerTimeAction
| GetServerTimeSuccessAction
| GetServerTimeFailureAction
| OtherAction

/* Action Creators */

export const getServerTime = (): AttempGetServerTimeAction => {
  return {
    type: TimeActionType.ATTEMPT_GET_SERVER_TIME,
  }
}
