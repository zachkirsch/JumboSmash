import firebase from 'react-native-firebase'
import { Store } from 'react-redux'
import { GiftedChatMessage, createMatch, receiveMessages } from '../matches'
import { RootState } from '../../redux'
import { User } from '../swipe'

const chatroomsBeingListenedTo = new Set<string>()

export const getRefToChatSection = (conversationId: string) => firebase.database().ref('chats').child(conversationId)
export const getRefToChatMessages = (conversationId: string) => getRefToChatSection(conversationId).child('messages')

interface ChatServiceType {
  store?: Store<RootState>
  setStore: (store: Store<RootState>) => void
  createChat: (conversationId: string, withUsers: User[]) => void
  listenForNewChats: (conversationId: string) => void
  stopListeningForNewChats: () => void
}

const dummy = () => {} /* tslint:disable-line:no-empty */

/* tslint:disable */
const ChatService: ChatServiceType = {
  setStore: dummy,
  createChat: dummy,
  listenForNewChats: dummy,
  stopListeningForNewChats: dummy,
}
/* tslint:enable */

ChatService.setStore = (store: Store<RootState>) => ChatService.store = store

ChatService.createChat = (conversationId: string, withUsers: User[]) => {
  const dbRef = getRefToChatSection(conversationId).child('members')
  const permissionsObject: { [uid: string]: string} = {}
  permissionsObject[firebase.auth().currentUser!.uid] = 'owner'
  dbRef.push(permissionsObject)
  ChatService.listenForNewChats(conversationId)
  ChatService.store!.dispatch(createMatch(conversationId, withUsers))
}

ChatService.listenForNewChats = (conversationId: string) => {
  if (!chatroomsBeingListenedTo.has(conversationId)) {
    chatroomsBeingListenedTo.add(conversationId)
    const dbRef = getRefToChatMessages(conversationId)
    dbRef.on('child_added', (firebaseMessage) => {
      if (firebaseMessage === null) {
        return
      }
      const message: GiftedChatMessage = {
        ...firebaseMessage.val(),
        createdAt: new Date(firebaseMessage.val().createdAt), // convert firebase's number to Date
      }
      ChatService.store!.dispatch(receiveMessages(conversationId, [message]))
    })
  }
}

ChatService.stopListeningForNewChats = () => {
  chatroomsBeingListenedTo.forEach(conversationId => {
    const dbRef = getRefToChatMessages(conversationId)
    dbRef.off('child_added')
  })
  chatroomsBeingListenedTo.clear()
}

export { ChatService }
