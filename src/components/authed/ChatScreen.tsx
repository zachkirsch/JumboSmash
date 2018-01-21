import React, { PureComponent } from 'react'
import { View, Button, StyleSheet } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0

interface OwnProps {
  user: string
}

type Props = NavigationScreenProps<OwnProps>

class ChatScreen extends PureComponent<Props, {}> {
    HEADER = 'Chatting with:' + this.props.navigation.state.params.user
    FIRSTMESSAGE = 'Lemme smash'
    state = {
          messages: [],
      }

      componentWillMount() {
          this.setState({ messages:  [
                  {
                      _id: Math.round(Math.random() * 1000000),
                      text: this.FIRSTMESSAGE,
                      createdAt: new Date(),
                      user: {
                          _id: 2,
                          name: this.props.navigation.state.params.user,
                      },
                      sent: true,
                      received: true,
                  },
                  {
                      _id: Math.round(Math.random() * 1000000),
                      text: this.HEADER,
                      createdAt: new Date(),
                      system: true,
                  },
              ]})
      }

      onSend(messages = []) {
          this.setState((previousState) => ({
              messages: GiftedChat.append(previousState.messages, messages),
          }))
      }

      render() {
          console.log(this.props)
          return (
              <View style={[styles.container, styles.center]}>
                  <Button onPress={() => this.props.navigation.goBack()} title='Go Back'/>
                  <GiftedChat
                  messages={this.state.messages}
                  onSend={(messages) => this.onSend(messages)}
                  user={{
                      _id: 1,
                  }}
                  parsePatterns={linkStyle => [
                      {
                          pattern: /#(\w+)/,
                          style: { ...linkStyle, color: 'lightgreen' },
                          onPress: props => alert(`press on ${props}`),
                      },
                  ]}
              />
              </View>
          )
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