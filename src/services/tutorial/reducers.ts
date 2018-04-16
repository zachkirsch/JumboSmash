import { TutorialAction, TutorialActionType } from './actions'
import { TutorialState } from './types'

const initialState: TutorialState = {
  finished: false
}

export function tutorialReducer(state = initialState, action: TutorialAction): TutorialState {
  switch (action.type) {

    case TutorialActionType.FINISH_TUTORIAL:
      return {
        finished: true
      }
    default:
      return state
  }
}
