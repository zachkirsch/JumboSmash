import { AuthActionType, AuthAction } from './actions'
import { AuthState } from './types'

const initialState: AuthState = {
  isLoggedIn: false,
  email: 'fakeuser@tufts.edu',
  session: '',
  errorMessage: '',
  validEmail: false,
  validVerificationCode: false,
  codeOfConductAccepted: false
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
        validEmail: true,
        errorMessage: ''
      }

    case AuthActionType.LOGIN_FAILURE:
      return {
        ...state,
        errorMessage: action.errorMessage,
      }

    case AuthActionType.ATTEMPT_VERIFY_EMAIL:
      return state

    case AuthActionType.VERIFY_EMAIL_SUCCESS:
      return {
        ...state,
        session: action.sessionKey,
        validVerificationCode: true,
        codeOfConductAccepted: action.codeOfConductAccepted,
        isLoggedIn: true,
        errorMessage: ''
      }

    case AuthActionType.VERIFY_EMAIL_FAILURE:
      return {
        ...state,
        validVerificationCode: false,
        errorMessage: action.errorMessage
      }

    case AuthActionType.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        session: '',
        validEmail: false,
        validVerificationCode: false
      }

    default:
      return initialState
  }
}
