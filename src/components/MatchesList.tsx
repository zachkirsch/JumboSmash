import React, { PureComponent } from 'react'
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'

type Props = NavigationScreenProps<{}>

interface State {
  userToChat: string
}

class MatchesList extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      userToChat: 'Tony'
    }
  }

  public render() {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>This is the matches screen</Text>
        <View style={styles.openChatContainer}>
          <TextInput
            style={styles.input}
            placeholder='Chat with...'
            onChangeText={this.onChangeUserToChat}
            value={this.state.userToChat}
          />
          <Button onPress={this.openChatScreen} title='Chat'/>
        </View>
      </View>
    )
  }

  private onChangeUserToChat = (userToChat: string) => {
    this.setState({
      userToChat,
    })
  }

  private openChatScreen = () => {
    this.props.navigation.navigate('Chat', { user: this.state.userToChat })
  }
}

export default MatchesList

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  center: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderColor: 'gray',
    borderBottomWidth: 1,
  },
  openChatContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 5,
    marginTop: 15
  }
})
