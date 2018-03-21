import { FirebaseAction, FirebaseActionType } from './actions'
import { FirebaseState } from './types'

const initialState: FirebaseState = {
  token: {
    value: '',
    loading: false,
  },
}

export function firebaseReducer(state = initialState, action: FirebaseAction): FirebaseState {
  const newState = {...state}
  switch (action.type) {

    case FirebaseActionType.ATTEMPT_CONNECT_TO_FIREBASE:
      newState.token = {
        value: action.token,
        loading: true,
      }
      return newState

    case FirebaseActionType.CONNECT_TO_FIREBASE_SUCCESS:
      newState.token.loading = false
      return newState

    case FirebaseActionType.CONNECT_TO_FIREBASE_FAILURE:
      newState.token = {
        value: state.token.value,
        loading: false,
        errorMessage: action.errorMessage,
      }
      return newState

    case FirebaseActionType.LOGOUT_FIREBASE:
      return initialState

    default:
      return state
  }
}
