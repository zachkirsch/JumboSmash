import React, { PureComponent } from 'react'
import { View, Button, StyleSheet } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Message, GiftedChat } from 'react-native-gifted-chat'

interface OwnProps {
  user: string
}

interface State {
  messages: Message[]
}

type Props = NavigationScreenProps<OwnProps>

const FIRST_MESSAGE = 'Lemme smash'

class ChatScreen extends PureComponent<Props, State> {

    constructor(props: Props) {
      super(props)
      this.state = {
        messages: [],
      }
    }

    componentWillMount() {
      this.setState({
        messages:  [
          {
            _id: 100,
            text: FIRST_MESSAGE,
            createdAt: new Date(),
            user: {
              _id: 2,
              name: this.props.navigation.state.params.user,
            },
            sent: true,
            received: true,
          },
          {
            _id: 101,
            text: 'Chatting with:' + this.props.navigation.state.params.user,
            createdAt: new Date(),
            system: true,
          },
        ],
      })
    }

    public render() {
      return (
        <View style={[styles.container, styles.center]}>
          <Button onPress={() => this.props.navigation.goBack()} title='Go Back'/>
          <GiftedChat
            messages={this.state.messages}
            onSend={this.onSend}
            user={{
              _id: 1,
              name: 'Max Bernstein',
            }}
          />
        </View>
      )
    }

    private onSend = (messages: Message[] = []) => {
      this.setState((previousState: State) => ({
          messages: GiftedChat.append(previousState.messages, messages),
      }))
    }
}

export default ChatScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flexDirection: 'column',
  },
})
