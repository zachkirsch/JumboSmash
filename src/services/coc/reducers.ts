import { CoCActionType, CoCAction } from './actions'
import { CoCState } from './types'

const initialState: CoCState = {
  codeOfConductAccepted: false,
}

export function cocReducer(state: CoCState, action: CoCAction): CoCState {
  switch (action.type) {

    case CoCActionType.ACCEPT_COC:
      return {
        codeOfConductAccepted: true,
      }

    default:
      return state || initialState
  }
}
