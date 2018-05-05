import { Store } from 'react-redux'
import { RootState } from '../../../redux'
import { logout } from '../../auth'

interface Token {
  email: string
  session_key: string
}

interface ApiAuthServiceType {
  store?: Store<RootState>
  setStore: (store: Store<RootState>) => void
  isLoggedIn: () => void
  logout: () => void
  getToken: () => Token
}

export const ApiAuthService: ApiAuthServiceType = { /* tslint:disable-line:variable-name */
  setStore: (store: Store<RootState>) => ApiAuthService.store = store,
  isLoggedIn: () => {
    const store = ApiAuthService.store
    return store && store.getState().auth.loggedIn.value
  },
  logout: () => {
    const store = ApiAuthService.store
    store && store.dispatch(logout())
  },
  getToken: (): Token => {
    if (!ApiAuthService.store) {
      return {
        email: '',
        session_key: '',
      }
    } else {
      const store = ApiAuthService.store
      return {
        email: store.getState().auth.email,
        session_key: store.getState().auth.sessionKey,
      }
    }
  },
}
