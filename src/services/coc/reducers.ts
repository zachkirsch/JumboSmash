import { CoCActionType, CoCAction } from './actions'
import { CoCState } from './types'

const initialState: CoCState = {
  codeOfConductAccepted: false,
  errorMessage: '',
}

export function cocReducer(state = initialState, action: CoCAction): CoCState {
  switch (action.type) {

    case CoCActionType.ATTEMPT_ACCEPT_COC:
    case CoCActionType.ACCEPT_COC_SUCCESS:
      return {
        codeOfConductAccepted: true,
        errorMessage: '',
      }

    case CoCActionType.ACCEPT_COC_FAILURE:
      return {
        ...state,
        errorMessage: action.errorMessage,
      }

    case CoCActionType.SET_COC_READ_STATUS:
      return {
        ...state,
        codeOfConductAccepted: action.readStatus,
      }

    default:
      return state
  }
}
