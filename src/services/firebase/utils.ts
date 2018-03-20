import { firebase } from './firebase'

const getRefToChatSection = (conversationId: string, suffix: string) => {
  const path = ['chats', conversationId, suffix].join('/')
  return firebase.database().ref(path)
}

export const getRefToChatMessages = (conversationId: string) => getRefToChatSection(conversationId, 'messages')

export const createChat = (conversationId: string) => {
  const dbRef = getRefToChatSection(conversationId, 'members')

  const permissionsObject: { [uid: string]: string} = {}
  permissionsObject[firebase.auth().currentUser.uid] = 'owner'
  dbRef.push(permissionsObject)
}
