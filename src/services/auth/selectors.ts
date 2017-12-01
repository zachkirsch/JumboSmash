import { getState } from '../../redux'

export const getEmail = () => getState().auth.email
export const getSessionKey = () => getState().auth.sessionKey
