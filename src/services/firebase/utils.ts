import firebase from 'react-native-firebase'
import { Store } from 'react-redux'
import { IChatMessage } from 'react-native-gifted-chat'
import { createMatch, receiveMessages } from '../matches'
import { RootState } from '../../redux'

const chatroomsBeingListenedTo = new Set<string>()

export const getRefToChatSection = (conversationId: string) => firebase.database().ref('chats').child(conversationId)
export const getRefToChatMessages = (conversationId: string) => getRefToChatSection(conversationId).child('messages')

interface ChatServiceType {
  store?: Store<RootState>
  setStore: (store: Store<RootState>) => void
  createChat: (matchId: number,
               conversationId: string,
               createdAt: string,
               otherUsers: number[],
               shouldOpenMatchPopup: boolean) => void
  listenForNewChats: (conversationId: string) => void
  stopListeningToChat: (conversationId: string) => void
  stopListeningForNewChats: () => void
}

const dummy = () => {} /* tslint:disable-line:no-empty */

/* tslint:disable */
const ChatService: ChatServiceType = {
  setStore: dummy,
  createChat: dummy,
  listenForNewChats: dummy,
  stopListeningToChat: dummy,
  stopListeningForNewChats: dummy,
}
/* tslint:enable */

ChatService.setStore = (store: Store<RootState>) => ChatService.store = store

ChatService.createChat = (matchId: number,
                          conversationId: string,
                          createdAt: string,
                          otherUsers: number[],
                          shouldOpenMatchPopup: boolean) => {
  const store = ChatService.store
  if (!store) {
    return
  }

  // PERMISSIONS
  const dbRef = getRefToChatSection(conversationId)
  dbRef.child('members').once('value', snapshot => {
    if (snapshot.val()) {
      return
    }

    // other users
    const firebaseUids: (string | undefined)[] = otherUsers.map(id => {
      const user = store.getState().swipe.allUsers.value.get(id)
      return user && user.firebaseUid
    })

    // this user
    const currentUser = firebase.auth().currentUser
    firebaseUids.push(currentUser ? currentUser.uid : undefined)

    const permissionsObject: { [uid: string]: string} = {}
    firebaseUids.forEach(uid => uid && (permissionsObject[uid] = 'member'))
    dbRef.child('members').set(permissionsObject)
  })

  ChatService.listenForNewChats(conversationId)
  store.dispatch(createMatch(matchId, conversationId, createdAt,
                             otherUsers, shouldOpenMatchPopup))
}

ChatService.listenForNewChats = (conversationId: string) => {
  if (!chatroomsBeingListenedTo.has(conversationId)) {
    chatroomsBeingListenedTo.add(conversationId)

    const dbRef = getRefToChatMessages(conversationId)
    dbRef.on('child_added', (firebaseMessage) => {

      if (firebaseMessage === null) {
        return
      }
      const message: IChatMessage = {
        ...firebaseMessage.val(),
      }

      const conversation = ChatService.store!.getState().matches.chats.get(conversationId)
      if (conversation && !conversation.messageIDs.has(message._id)) {
        ChatService.store!.dispatch(receiveMessages(conversationId, [message]))
      }
    })
  }
}

ChatService.stopListeningToChat = (conversationId: string) => {
  if (chatroomsBeingListenedTo.has(conversationId)) {
    const dbRef = getRefToChatMessages(conversationId)
    dbRef.off('child_added')
    chatroomsBeingListenedTo.delete(conversationId)
  }
}

ChatService.stopListeningForNewChats = () => {
  chatroomsBeingListenedTo.forEach(ChatService.stopListeningToChat)
  chatroomsBeingListenedTo.clear()
}

export { ChatService }
