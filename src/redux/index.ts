import { AuthState } from '../services/auth'

export interface RootState {
  auth: AuthState
}

export * from './rootReducer'
export * from './rootSaga'
