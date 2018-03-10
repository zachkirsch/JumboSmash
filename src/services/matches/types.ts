export interface Message {
  _id: number
  text: string
  createdAt: Date
  user: User
  sending: boolean
  failedToSend: boolean
  sent: boolean
  received: boolean
  read: boolean
}

export interface User {
  _id: number
  name: string
  mostRecentMessage: string
}

export interface MatchesState {
  matches: {
    [userId: number]: {
      user: User
      messages: Message[]
    }
  }
}
