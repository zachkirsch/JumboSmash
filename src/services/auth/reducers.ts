import { AuthActionType, AuthAction } from './actions'
import { AuthState } from './types'

const initialState: AuthState = {
  isLoggedIn: false,
  isNewUser: true,
  email: 'zachary.kirsch@tufts.edu',
  sessionKey: '',
  errorMessage: '',
  validVerificationCode: false,
  waitingForRequestVerificationResponse: false,
  waitingForVerificationResponse: false,
}

export function authReducer(state = initialState, action: AuthAction): AuthState {
  switch (action.type) {

    case AuthActionType.ATTEMPT_REQUEST_VERIFICATION:
      return {
        ...initialState,
        email: action.credentials.email,
        waitingForRequestVerificationResponse: true,
      }

    case AuthActionType.REQUEST_VERIFICATION_SUCCESS:
      return {
        ...state,
        isNewUser: action.isNewUser,
        waitingForRequestVerificationResponse: false,
      }

    case AuthActionType.REQUEST_VERIFICATION_FAILURE:
      return {
        ...state,
        errorMessage: action.errorMessage,
        waitingForRequestVerificationResponse: false,
      }

    case AuthActionType.ATTEMPT_VERIFY_EMAIL:
      return {
        ...state,
        waitingForVerificationResponse: true,
      }

    case AuthActionType.VERIFY_EMAIL_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        validVerificationCode: true,
        waitingForVerificationResponse: false,
      }

    case AuthActionType.VERIFY_EMAIL_FAILURE:
      return {
        ...state,
        errorMessage: action.errorMessage,
        waitingForVerificationResponse: false,
      }

    case AuthActionType.SET_SESSION_KEY:
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
        ...initialState,
        email: state.email,
      }

    default:
      return state
  }
}
