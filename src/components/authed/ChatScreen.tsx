import React, { PureComponent } from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'

interface OwnProps {
  user: string
}

type Props = NavigationScreenProps<OwnProps>

class ChatScreen extends PureComponent<Props, {}> {

  public render() {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>Chatting with: {this.props.navigation.state.params.user}</Text>
        <Button onPress={() => this.props.navigation.goBack()} title='Go Back'/>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
})
