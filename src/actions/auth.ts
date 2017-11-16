import { TypeKey } from '../actions'

export interface Credentials {
  username: string
  password: string
}

export interface LoginSuccessAction {
  type: TypeKey.LOGIN_SUCCESS,
  username: string,
  session: string
}

export interface LoginFailureAction {
  type: TypeKey.LOGIN_FAILURE
  username: string,
}

type LoginAction = LoginSuccessAction | LoginFailureAction

export interface LogoutAction {
  type: TypeKey.LOGOUT
}

export const login = (credentials: Credentials): LoginAction => {
  const username = credentials.username
  const password = credentials.password

  if (username.toLowerCase() === 'fakeuser' && password === 'password') {
    return {
      type: TypeKey.LOGIN_SUCCESS,
      username,
      session: 'session key'
    }
  } else {
    return {
      type: TypeKey.LOGIN_FAILURE,
      username
    }
  }
}

export const logout = (): LogoutAction => {
  return {
    type: TypeKey.LOGOUT
  }
}
