import { CoCActionType, CoCAction } from './actions'
import { CoCState } from './types'

const initialState: CoCState = {
  codeOfConductAccepted: false,
  errorMessage: '',
}

export function cocReducer(state: CoCState, action: CoCAction): CoCState {
  switch (action.type) {

    case CoCActionType.ACCEPT_COC_SUCCESS:
      return {
        codeOfConductAccepted: true,
        errorMessage: '',
      }

    case CoCActionType.ACCEPT_COC_FAILURE:
      return {
        codeOfConductAccepted: false,
        errorMessage: action.errorMessage,
      }

    default:
      return {...state} || initialState
  }
}
