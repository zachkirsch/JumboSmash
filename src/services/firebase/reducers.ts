import { FirebaseActionType, FirebaseAction } from './actions'
import { FirebaseState } from './types'

const initialState: FirebaseState = {
    loading: false,
    token: '',
    errorMessage: '',
}

export function firebaseReducer(state = initialState, action: FirebaseAction): FirebaseState {
    switch (action.type) {

        case FirebaseActionType.ATTEMPT_CONNECT_TO_FIREBASE:
            return {
                ...state,
                loading: true,
                token: action.token,
            }

        case FirebaseActionType.CONNECT_TO_FIREBASE_SUCCESS:
            return {
                ...state,
                loading: false,
                errorMessage: '',
            }

        case FirebaseActionType.CONNECT_TO_FIREBASE_FAILURE:
            return {
                ...state,
                loading: false,
                errorMessage: action.errorMessage,
                token: '',
            }

        case FirebaseActionType.LOGOUT_FIREBASE:
            return initialState

        default:
            return state
    }
}
