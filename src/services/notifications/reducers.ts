import { NotificationsAction } from './actions'
import { NotificationsState } from './types'

const initialState: NotificationsState = {
}

export function notificationsReducer(state = initialState, action: NotificationsAction): NotificationsState {
  switch (action.type) {

    default:
      return state
  }
}
