declare module 'react-native-gifted-chat' {

  import { Component } from 'react'

  interface User {
    _id: number
    name: string
  }

  interface BaseMessage {
    _id: number
    text: string
    createdAt: Date
  }

  interface UserMessage extends BaseMessage {
    user: User
    sent: boolean
    received: boolean
  }

  interface SystemMessage extends BaseMessage {
    system: boolean
  }

  export type Message = UserMessage | SystemMessage

  // GiftedChat component

  interface GiftedChatProps {
    messages: Message[]
    user: User
    onSend: (messages: Message[]) => void
  }

  export class GiftedChat extends Component<GiftedChatProps, {}> {

    static append(previousMessages: Message[], newMessages: Message[]): Message[]

    public render(): JSX.Element

  }

}
