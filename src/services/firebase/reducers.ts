import { FirebaseActionType, FirebaseAction } from './actions'
import { FirebaseState } from './types'

const initialState: FirebaseState = {
    restoring: false,
    loading: false,
    user: '',
    errorMessage: '',
}

export function firebaseReducer(state = initialState, action: FirebaseAction): FirebaseState {
    switch (action.type) {

        case FirebaseActionType.RESTORE_FIREBASE_SESSION:
            return {
                ...state,
                restoring: true,
            }

        case FirebaseActionType.ATTEMPT_LOAD_FIREBASE_SESSION:
            return {
                ...state,
                restoring: false,
                loading: true,
                errorMessage: '',
            }

        case FirebaseActionType.LOAD_FIREBASE_SESSION_SUCCESS:
            return {
                ...state,
                restoring: false,
                loading: false,
                user: action.user,
                errorMessage: '',
            }

        case FirebaseActionType.LOAD_FIREBASE_SESSION_FAILURE:
            return {
                ...state,
                restoring: false,
                loading: false,
                user: '',
                errorMessage: action.errorMessage,
            }

        case FirebaseActionType.LOGOUT_FIREBASE_SESSION:
            return initialState

        default:
            return state
    }
}
