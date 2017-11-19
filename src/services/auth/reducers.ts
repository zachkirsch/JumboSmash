import { AuthActionType, AuthAction } from './actions'
import { AuthState } from './types'

const initialState: AuthState = {
  isLoggedIn: false,
  email: 'fakeuser@tufts.edu',
  session: '',
  errorMessage: ''
}

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {

    case AuthActionType.ATTEMPT_LOGIN:
      return {
        ...initialState,
        email: action.credentials.email,
      }

    case AuthActionType.LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        session: action.sessionKey,
      }

    case AuthActionType.LOGIN_FAILURE:
      return {
        ...state,
        errorMessage: action.errorMessage,
      }

    case AuthActionType.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        session: ''
      }

    default:
      return initialState
  }
}
