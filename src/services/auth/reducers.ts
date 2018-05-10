import { AuthAction, AuthActionType } from './actions'
import { AuthState } from './types'

const initialState: AuthState = {
  loggedIn: {
    value: false,
    loading: false,
  },
  verified: {
    value: false,
    loading: false,
  },
  isNewUser: true,
  email: '',
  sessionKey: '',
  waitingForRequestVerificationResponse: false,
  tutorialFinished: false,
  codeOfConductAccepted: false,
  nearTufts: false,
  deviceId: '',
}

export function authReducer(state = initialState, action: AuthAction): AuthState {
  switch (action.type) {

    case AuthActionType.ATTEMPT_REQUEST_VERIFICATION:
      return {
        ...initialState,
        email: action.credentials.email,
        waitingForRequestVerificationResponse: !action.resend,
      }

    case AuthActionType.REQUEST_VERIFICATION_SUCCESS:
      return {
        ...state,
        isNewUser: action.isNewUser,
        deviceId: action.deviceId,
        waitingForRequestVerificationResponse: false,
      }

    case AuthActionType.REQUEST_VERIFICATION_FAILURE:
      return {
        ...state,
        verified: {
          value: false,
          loading: false,
          errorMessage: action.errorMessage,
        },
        waitingForRequestVerificationResponse: false,
      }

    case AuthActionType.ATTEMPT_VERIFY_EMAIL:
      return {
        ...state,
        loggedIn: {
          value: false,
          loading: true,
        },
        verified: {
          value: false,
          loading: true,
        },
      }

    case AuthActionType.VERIFY_EMAIL_SUCCESS:
      return {
        ...state,
        verified: {
          value: true,
          loading: false,
        },
        sessionKey: action.sessionKey,
      }

    case AuthActionType.VERIFY_EMAIL_FAILURE:
      return {
        ...state,
        loggedIn: {
          value: false,
          loading: false,
        },
        verified: {
          value: false,
          loading: false,
          errorMessage: action.errorMessage,
        },
      }

    case AuthActionType.LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: {
          value: true,
          loading: false,
        },
      }

    case AuthActionType.LOGIN_FAILURE:
      return {
        ...state,
        loggedIn: {
          value: false,
          loading: false,
          errorMessage: action.errorMessage,
        },
      }

    case AuthActionType.CONFIRM_NEAR_TUFTS:
      return {
        ...state,
        nearTufts: true,
      }

    case AuthActionType.SET_SESSION_KEY:
      return {
        ...state,
        sessionKey: action.sessionKey,
      }

    case AuthActionType.FINISH_TUTORIAL:
      return {
        ...state,
        tutorialFinished: true,
      }

    case AuthActionType.ATTEMPT_ACCEPT_COC:
    case AuthActionType.ACCEPT_COC_SUCCESS:
      return {
        ...state,
        codeOfConductAccepted: true,
      }

    case AuthActionType.ACCEPT_COC_FAILURE:
      return {
        ...state,
      }

    case AuthActionType.SET_COC_READ_STATUS:
      return {
        ...state,
        codeOfConductAccepted: action.readStatus,
      }

    case AuthActionType.CLEAR_AUTH_ERROR_MESSAGES:
      return {
        ...state,
        loggedIn: {
          ...state.loggedIn,
          errorMessage: undefined,
        },
        verified: {
          ...state.verified,
          errorMessage: undefined,
        },
      }

    case AuthActionType.DEACTIVATE:
    case AuthActionType.LOGIN_FAILURE:
    case AuthActionType.LOGOUT:
      return {
        ...initialState,
        email: state.email,
        // we keep the session key around so we can logout from the server.
        // after this is done, a SET_SESSION_KEY action should be dispatched
        // to clear the session key.
        sessionKey: state.sessionKey,
      }

    default:
      return state
  }
}
