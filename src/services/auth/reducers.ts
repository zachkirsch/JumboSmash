import { AuthActionType, AuthAction } from './actions'
import { AuthState } from './types'

const initialState: AuthState = {
  isLoggedIn: false,
  email: 'fakeuser@tufts.edu',
  sessionKey: '',
  errorMessage: '',
  validEmail: false,
  validVerificationCode: false,
}

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {

    case AuthActionType.ATTEMPT_REQUEST_VERIFICATION:
      return {
        ...initialState,
        email: action.credentials.email,
      }

    case AuthActionType.REQUEST_VERIFICATION_SUCCESS:
      return {
        ...state,
        validEmail: true,
        errorMessage: '',
      }

    case AuthActionType.REQUEST_VERIFICATION_FAILURE:
      return {
        ...state,
        errorMessage: action.errorMessage,
      }

    case AuthActionType.ATTEMPT_VERIFY_EMAIL:
      return state

    case AuthActionType.VERIFY_EMAIL_SUCCESS:
      return {
        ...state,
        sessionKey: action.sessionKey,
        validVerificationCode: true,
        isLoggedIn: true,
        errorMessage: '',
      }

    case AuthActionType.VERIFY_EMAIL_FAILURE:
      return {
        ...state,
        validVerificationCode: false,
        errorMessage: action.errorMessage,
      }

    case AuthActionType.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        sessionKey: '',
        validEmail: false,
        validVerificationCode: false,
      }

    default:
      return state || initialState
  }
}
