import React, { PureComponent } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import MatchesListItem from './MatchesListItem'
import { MatchesState, Message, User, sendMessages } from '../../services/matches'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../redux'

interface Chat {
  id: number,
  time: number,
  isSender: boolean,
  read: boolean,
  text: string,
}

// interface User {
//   name: string,
//   id: number,
//   profilePic: string,
//   messages: Chat[],
// }

interface ConversationDataItem {
  conversationId: string,
  otherUsers: User[],
  mostRecentMessage: string,
}

interface State {
  usersToChat: User[],
  matchesArray: ConversationDataItem[]
}

interface StateProps {
  matches: {
    [conversationId: string]: {
      otherUsers: User[]
      messages: Message[]
      mostRecentMessage: string
    }
  }
}

interface DispatchProps {
  sendMessages: (conversationId: string, messages: Message[]) => void
}

type Props = OwnProps & StateProps & DispatchProps

class MatchesList extends PureComponent<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
          matchesArray: Object.keys(this.props.matches).map((conversationId: string) => {
            console.log('this is the most recent', this.props.matches[conversationId].mostRecentMessage)
            return {
              conversationId,
              otherUsers: this.props.matches[conversationId].otherUsers,
              mostRecentMessage: this.props.matches[conversationId].mostRecentMessage,
            }
          }),
          usersToChat: [
            {
              name: 'Greg Aloupis',
              id: 0,
              profilePic: 'http://www.cs.tufts.edu/people/faculty/images/GregAloupis.png',
              messages: [
                {
                  id: 0,
                  time: Date.now(),
                  isSender: false,
                  read: true,
                  text: 'Great!',
                },
                {
                  id: 1,
                  time: Date.now(),
                  isSender: true,
                  read: true,
                  text: 'ok!',
                },
                {
                  id: 2,
                  time: Date.now(),
                  isSender: false,
                  read: true,
                  text: 'Lemme smashhhhhh',
                },
                {
                  id: 3,
                  time: Date.now(),
                  isSender: false,
                  read: true,
                  text: 'Hey',
                },
              ],

            },
            {
              name: 'Zach Kirsch',
              id: 1,
              profilePic: 'https://scontent.fzty2-1.fna.fbcdn.net' +
              '/v/t31.0-8/17039378_10212402239837389_6623819361607561120_o.jpg?oh=da5905077fe2f7ab636d9e7ac930133c&oe=5B113366',
              messages: [
                {
                  id: 4,
                  time: Date.now(),
                  isSender: false,
                  read: false,
                  text: 'Sliding into those DMs',
                },
              ],

            },
            {
              name: 'Jeff Bezos',
              id: 2,
              profilePic: 'http://mblogthumb3.phinf.naver.net/20160823_162/' +
              'banddi95_14719406421210hOJW_JPEG/%B0%A1%C0%E5_%C6%ED%C7%CF%B0%D4_%BD%C7%C6%D0%C7%D2_%BC%F6_%C0%D6%B4%C2_%C8%B8%BB%E7.jpg?type=w800',
              messages: [
                {
                  id: 5,
                  time: Date.now(),
                  isSender: false,
                  read: true,
                  text: 'Thoughts on Whole Foods?',
                },
              ],

            },
            {
              name: 'Mewtwo',
              id: 3,
              profilePic: 'https://cdn.bulbagarden.net/upload/thumb/7/78/150Mewtwo.png/250px-150Mewtwo.png',
              messages: [
                {
                  id: 6,
                  time: Date.now(),
                  isSender: false,
                  read: false,
                  text: 'I see now that the circumstances of one\'s birth are irrelevant. ' +
                  'It is what you do with the gift of life that determines who you are.',
                },
              ],

            },
            {
              name: 'Bane',
              id: 4,
              profilePic: 'http://www.fitzness.com/blog/wp-content/uploads/Tom-Hardy-Bane-Head-Shot.jpeg',
              messages: [
                {
                  id: 7,
                  time: Date.now(),
                  isSender: false,
                  read: false,
                  text: 'Crashing this plane with no survivors',
                },
              ],

            },
        ],
      }
    }

  componentWillReceiveProps(oldProps: Props, newProps: Props) {
      console.log('new props', newProps)
    this.setState({
      ...this.state,
      messagesArray: Object.keys(newProps.matches).map((conversationId: string) => {
        console.log('this is the most recent', newProps.matches[conversationId].mostRecentMessage)
        return {
          conversationId,
          otherUsers: newProps.matches[conversationId].otherUsers,
          mostRecentMessage: newProps.matches[conversationId].mostRecentMessage,
        }
      })
    })
  }

    public render() {
        return (
            <View style={[styles.container]}>
                <FlatList
                    data={this.state.matchesArray}
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

    private openChatScreen = (conversationId: string) => {
        const user = this.props.matches[conversationId].otherUsers[0]
        this.props.navigation.navigate('Chat', {
          name: user.name,
          id: user.id,
          profilePic: user.avatar,
          conversationId,
          sendMessages: (messages: Message[]) => this.props.sendMessages(conversationId, messages),
        })
    }

    private renderItem = ({item}: {item: ConversationDataItem}) => {
        return (
            <MatchesListItem
              key={item.conversationId}
              name={item.otherUsers[0].name.split(' ')[0]}
              onPress={() => this.openChatScreen(item.conversationId)}
              lastMessage={item.mostRecentMessage}
              messageRead={true}
              profilePic={item.otherUsers[0].avatar}
            />
        )
    }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    matches: state.matches.matches
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    sendMessages: (conversationId: string, messages: Message[]) => dispatch(sendMessages(conversationId, messages)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchesList)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
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
