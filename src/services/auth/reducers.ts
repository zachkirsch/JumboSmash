import { AuthActionType, AuthAction, SessionState } from './types'

const initialState: SessionState = {
  isLoggedIn: false,
  username: '',
  session: '',
  errorMessage: ''
}

export function authReducer(state: SessionState, action: AuthAction) {
    switch (action.type) {

      case AuthActionType.ATTEMPT_LOGIN:
        return Object.assign(initialState, {
          username: action.credentials.username,
        })

      case AuthActionType.LOGIN_SUCCESS:
        return Object.assign({}, state, {
          isLoggedIn: true,
          session: action.sessionKey,
        })

      case AuthActionType.LOGIN_FAILURE:
        return Object.assign({}, state, {
          errorMessage: action.errorMessage,
        })

      case AuthActionType.LOGOUT:
        return Object.assign({}, state, {
          isLoggedIn: false,
          session: ''
        })

      default:
        return initialState
    }
  }
