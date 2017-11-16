import { TypeKey, ActionType } from '../actions'

interface SessionState {
  isLoggedIn: boolean
  username: string
  session: string
}

const initialState: SessionState = {
    isLoggedIn: false,
    username: '',
    session: '',
}

export default function reducer(state: SessionState, action: ActionType) {
  switch (action.type) {
    case TypeKey.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isLoggedIn: true,
        username: action.username,
        session: action.session,
      })
    case TypeKey.LOGIN_FAILURE:
      return Object.assign({}, state, {
        username: action.username,
      })
    case TypeKey.LOGOUT:
    default:
      return initialState
  }
}
