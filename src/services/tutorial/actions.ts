/* Actions */

export enum TutorialActionType {
  FINISH_TUTORIAL = 'FINISH_TUTORIAL',
  OTHER_ACTION = '__any_other_action_type__',
}

export interface FinishTutorialAction {
  type: TutorialActionType.FINISH_TUTORIAL
}
/* the point of the OtherAction action is for TypeScript to warn us if we don't
 * have a default case when processing actions. We will never dispatch
 * OtherAction, but we do need a default case for the other Actions that are
 * dispatched (by third-party plugins and Redux itself). For more information,
 * see https://spin.atomicobject.com/2017/07/24/redux-action-pattern-typescript/
 */

export interface OtherAction {
  type: TutorialActionType.OTHER_ACTION
}

export type TutorialAction =
  FinishTutorialAction
| OtherAction

/* Action Creators */

export const finishTutorial = (): FinishTutorialAction => {
  return {
    type: TutorialActionType.FINISH_TUTORIAL,
  }
}
