import React, { PureComponent } from 'react'
import { View, Button, StyleSheet, FlatList } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'

type Props = NavigationScreenProps<{}>

interface User {
  key: string
}

interface x {
  item: User
}

interface State {
  userToChat: User[]
}

class MatchesList extends PureComponent<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            userToChat: [
                {key: 'Tony Monaco'},
                {key: 'Yuki Zaninovich'},
                {key: 'Zach Kirsch'},
                {key: 'Shanshan Duan'},
                {key: 'Chris Gregg'},
            ]
        }
    }

    public render() {
        return (
            <View style={[styles.container]}>
                <FlatList
                    data={this.state.userToChat}
                    renderItem={this.renderItem}
                />
                {/*<TextInput*/}
                {/*style={styles.input}*/}
                {/*placeholder='Chat with...'*/}
                {/*onChangeText={this.onChangeUserToChat}*/}
                {/*value={this.state.userToChat}*/}
                {/*/>*/}
                {/*<Button onPress={this.openChatScreen} title='Chat'/>*/}
            </View>
        )
    }

    // private onChangeUserToChat = (userToChat: string) => {
    //     this.setState({
    //         userToChat,
    //     })
    // }

    private openChatScreen(userToChat: string) {
        this.props.navigation.navigate('Chat', {user: userToChat})
    }

    private renderItem = (y: x) => {
        return (
            <Button
                onPress={() => this.openChatScreen(y.item.key)}
                title={y.item.key}
            />
        )
    }
}

export default MatchesList

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: 15,
  },
})
