import { AuthActionType, AuthAction } from './actions'
import { AuthState } from './types'

const initialState: AuthState = {
  isLoggedIn: false,
  isNewUser: true,
  email: 'zachary.kirsch@tufts.edu',
  sessionKey: '',
  errorMessage: '',
  validEmail: false,
  validVerificationCode: false,
  waitingForVerificationResponse: false,
}

export function authReducer(state = initialState, action: AuthAction): AuthState {
  switch (action.type) {

    case AuthActionType.ATTEMPT_REQUEST_VERIFICATION:
      return {
        ...state,
        email: action.credentials.email,
        waitingForVerificationResponse: true,
      }

    case AuthActionType.REQUEST_VERIFICATION_SUCCESS:
      return {
        ...state,
        isNewUser: action.isNewUser,
        validEmail: true,
        errorMessage: '',
        waitingForVerificationResponse: false,
      }

    case AuthActionType.REQUEST_VERIFICATION_FAILURE:
      return {
        ...state,
        validEmail: false,
        errorMessage: action.errorMessage,
        waitingForVerificationResponse: false,
      }

    case AuthActionType.VERIFY_EMAIL_SUCCESS:
      return {
        ...state,
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

    case AuthActionType.STORE_SESSION_KEY:
      return {
        ...state,
        sessionKey: action.sessionKey,
      }

    case AuthActionType.CLEAR_AUTH_ERROR_MESSAGE:
      return {
        ...state,
        errorMessage: '',
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
      return state
  }
}
