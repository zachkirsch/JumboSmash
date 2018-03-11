import { put, takeEvery } from 'redux-saga/effects'
import { firebase } from '../firebase'
import {
  MatchesActionType,
  AttemptSendMessagesAction,
  SendMessagesSuccessAction,
  SendMessagesFailureAction,
} from './actions'

function* attemptSendMessages(action: AttemptSendMessagesAction) {
  const path = 'messages/'.concat(action.conversationId)
  const dbRef = firebase.database().ref(path)

  console.log('sagas')
  for (let message of action.messages) {
    dbRef.push({
      _id: message._id,
      text: message.text,
      user: {
        _id: 1,
        name: 'test',
        avatar: '',
      },
      date: new Date().getTime(),
      read: false,
    })
  }

  const successAction: SendMessagesSuccessAction = {
    type: MatchesActionType.SEND_MESSAGES_SUCCESS,
    conversationId: action.conversationId,
    messages: action.messages,
  }
  yield put(successAction)
}

export function* matchesSaga() {
  yield takeEvery(MatchesActionType.ATTEMPT_SEND_MESSAGES, attemptSendMessages)
}
