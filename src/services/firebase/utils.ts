import { firebase } from './firebase'

const getRefToChatSection = (conversationId: string) => firebase.database().ref('chats').child(conversationId)

export const getRefToChatMessages = (conversationId: string) => getRefToChatSection(conversationId).child('messages')

export const createChat = (conversationId: string) => {
  const dbRef = getRefToChatSection(conversationId).child('members')

  const permissionsObject: { [uid: string]: string} = {}
  permissionsObject[firebase.auth().currentUser.uid] = 'owner'
  dbRef.push(permissionsObject)
}
