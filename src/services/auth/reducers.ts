import { AuthActionType, AuthAction } from './actions'
import { AuthState } from './types'

const initialState: AuthState = {
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
        ...state,
        email: action.credentials.email,
        waitingForRequestVerificationResponse: true,
        errorMessage: '',
      }

    case AuthActionType.REQUEST_VERIFICATION_SUCCESS:
      return {
        ...state,
        isNewUser: action.isNewUser,
        errorMessage: '',
        validVerificationCode: false,
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
        errorMessage: '',
        waitingForVerificationResponse: true,
      }

    case AuthActionType.VERIFY_EMAIL_SUCCESS:
      return {
        ...state,
        validVerificationCode: true,
        errorMessage: '',
        waitingForVerificationResponse: false,
        sessionKey: action.sessionKey ,
      }

    case AuthActionType.VERIFY_EMAIL_FAILURE:
      return {
        ...state,
        validVerificationCode: false,
        errorMessage: action.errorMessage,
        waitingForVerificationResponse: false,
      }

    case AuthActionType.CLEAR_AUTH_ERROR_MESSAGE:
      return {
        ...state,
        errorMessage: '',
      }

    case AuthActionType.LOGOUT:
      return {
        ...state,
        sessionKey: '',
      }

    default:
      return state
  }
}
