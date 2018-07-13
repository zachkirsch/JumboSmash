import { Answers } from 'react-native-fabric'
import { call, all, put, select, takeLatest } from 'redux-saga/effects'
import { RootState } from '../../redux'
import * as api from '../api'
import { ChatService, setFirebaseToken, attemptConnectToFirebase, logoutFirebase } from '../firebase'
import { clearMatchesState } from '../matches'
import { clearProfileState, initializeProfile } from '../profile'
import { clearSwipeState, fetchAllUsers, fetchSwipableUsers } from '../swipe'
import { isSenior } from '../../utils'
import { clearNavigationState } from '../navigation'
import { clearNotificationsState } from '../notifications/actions'
import * as AuthActions from './actions'
import { rehydrateMatchesFromServer } from '../matches/actions'
import { ImageCacheService } from '../image-caching'

const getDeviceId = (state: RootState) => state.auth.deviceId
const getFirebaseToken = (state: RootState) => state.firebase.token.value

function* handleRequestVerificationSuccess(isNewUser: boolean, deviceId: string) {
  const requestVerificationSuccessAction: AuthActions.RequestVerificationSuccessAction = {
    type: AuthActions.AuthActionType.REQUEST_VERIFICATION_SUCCESS,
    isNewUser,
    deviceId,
  }
  yield put(requestVerificationSuccessAction)
}

function* handleRequestVerificationError(error: Error) {
  const requestVerificationFailureAction: AuthActions.RequestVerificationFailureAction = {
    type: AuthActions.AuthActionType.REQUEST_VERIFICATION_FAILURE,
    errorMessage: error.message,
  }
  yield put(requestVerificationFailureAction)
}

function* attemptRequestVerification(payload: AuthActions.AttemptRequestVerificationAction) {
  try {
    const response: api.RequestVerificationResponse = yield call(api.api.requestVerification, payload.credentials)
    yield handleRequestVerificationSuccess(response.new_user, response.device_id)

    // if new user, log signup with Answers
    if (response.new_user) {
      Answers.logSignUp('Email', true, { email: payload.credentials.email })
    }
  } catch (error) {
    yield handleRequestVerificationError(error)
  }

}

function* handleEmailVerificationSuccess(sessionKey: string, classYear: number) {
  const verifyEmailSuccessAction: AuthActions.VerifyEmailSuccessAction = {
    type: AuthActions.AuthActionType.VERIFY_EMAIL_SUCCESS,
    sessionKey,
    classYear,
  }
  yield put(verifyEmailSuccessAction)
}

function* handleEmailVerificationError(error: Error) {
  const verifyEmailFailureAction: AuthActions.VerifyEmailFailureAction = {
    type: AuthActions.AuthActionType.VERIFY_EMAIL_FAILURE,
    errorMessage: error.message,
  }
  yield put(verifyEmailFailureAction)
}

function* attemptLogin() {
  try {
    const meInfo: api.MeResponse = yield call(api.api.me)
    yield put(AuthActions.setCoCReadStatus(meInfo.accepted_coc))

    // rehydrate the user's profile
    const response = yield all([
      call(api.api.getTags),
      call(api.api.getReacts),
      call(api.api.getEvents),
      call(api.api.getBucketList),
    ])
    const allTags: api.GetTagsResponse = response[0]
    const allReacts: api.GetReactsResponse = response[1]
    const allEvents: api.GetEventsResponse = response[2]
    const allBucketListItems: api.GetBucketListResponse = response[3]
    yield put(initializeProfile(allTags, allReacts, allEvents, allBucketListItems, meInfo))
    yield put(rehydrateMatchesFromServer(meInfo.active_matches.map(match => ({
      id: match.id,
      createdAt: match.createdAt,
      conversationId: match.conversation_uuid,
      otherUsers: match.users.reduce((acc, user) => {
        if (user.id !== meInfo.id) {
          acc.push(user.id)
        }
        return acc
      }, [] as number[]),
    }))))

    // fetch users
    yield put(fetchAllUsers())
    yield put(fetchSwipableUsers())

    const loginSuccessAction: AuthActions.LoginSuccessAction = {
      type: AuthActions.AuthActionType.LOGIN_SUCCESS,
    }
    yield put(loginSuccessAction)
  } catch (e) {
    const loginFailureAction: AuthActions.LoginFailureAction = {
      type: AuthActions.AuthActionType.LOGIN_FAILURE,
      errorMessage: e.message,
    }
    yield put(loginFailureAction)
  }
}

function* attemptVerifyEmail(payload: AuthActions.AttemptVerifyEmailAction) {
  try {
    const deviceId: string = yield select(getDeviceId)
    let response: api.VerifyEmailResponse  = yield call(
      api.api.verifyEmail,
      payload.verificationCode,
      deviceId
    )

    yield handleEmailVerificationSuccess(response.session_key, response.class_year)
    if (response && isSenior(response.class_year)) {
      yield put(attemptConnectToFirebase(response.firebase_token))
    } else {
      yield put(setFirebaseToken(response.firebase_token))
    }
  } catch (error) {
    yield handleEmailVerificationError(error)
  }
}

function* confirmNearTufts() {
  const firebaseToken: string = yield select(getFirebaseToken)
  yield put(attemptConnectToFirebase(firebaseToken))
}

function* handleAcceptCoCError(error: Error) {
  const acceptCoCFailureAction: AuthActions.AcceptCoCFailureAction = {
    type: AuthActions.AuthActionType.ACCEPT_COC_FAILURE,
    errorMessage: error.message,
  }
  yield put(acceptCoCFailureAction)
}

function* acceptCoC(_: AuthActions.AttemptAcceptCoCAction) {
    try {
      yield call(api.api.acceptCoC)
      yield put(AuthActions.setCoCReadStatus(true))
    } catch (error) {
      yield handleAcceptCoCError(error)
    }
}

function* clearState() {
  yield put(clearProfileState())
  yield put(clearNavigationState())
  yield put(clearSwipeState())
  yield put(clearMatchesState())
  yield put(clearNotificationsState())
  yield put(AuthActions.setSessionKey(''))
  ImageCacheService.clearCache()
  ChatService.stopListeningForNewChats()
  yield put(logoutFirebase())
}

function* logout() {
  try {
    yield call(api.api.logout)
  } catch (e) {} /* tslint:disable-line:no-empty */
  yield clearState()
}

function* deactivate() {
  try {
    yield call(api.api.deactivate)
  } catch (e) {} /* tslint:disable-line:no-empty */
  yield clearState()
}

export function* authSaga() {
  yield takeLatest(AuthActions.AuthActionType.ATTEMPT_REQUEST_VERIFICATION, attemptRequestVerification)
  yield takeLatest(AuthActions.AuthActionType.ATTEMPT_VERIFY_EMAIL, attemptVerifyEmail)
  yield takeLatest(AuthActions.AuthActionType.ATTEMPT_LOGIN, attemptLogin)
  yield takeLatest(AuthActions.AuthActionType.LOGOUT, logout)
  yield takeLatest(AuthActions.AuthActionType.DEACTIVATE, deactivate)
  yield takeLatest(AuthActions.AuthActionType.ATTEMPT_ACCEPT_COC, acceptCoC)
  yield takeLatest(AuthActions.AuthActionType.CONFIRM_NEAR_TUFTS, confirmNearTufts)
}
