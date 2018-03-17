import React, { PureComponent } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { Map } from 'immutable'
import MatchesListItem from './MatchesListItem'
import { Conversation, Message, sendMessages, receiveMessages } from '../../services/matches'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../redux'
import {firebase} from "../../services/firebase";

interface State { }

interface OwnProps { }

interface StateProps {
  chats: Map<string, Conversation>,
}

interface DispatchProps {
  sendMessages: (conversationId: string, messages: Message[]) => void,
  receiveMessages: (conversationId: string, messages: Message[]) => void,
}

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>

class MatchesList extends PureComponent<Props, State> {

  componentDidMount() {
    const path = 'messages/'
    let receiveMessagesFunc: (conversationId: string, messages: Message[]) => void = this.props.receiveMessages

    for (let chat of this.props.chats.toArray()) {
      const dbRef = firebase.database().ref(path.concat(chat.conversationId))
      const myId = this.props.chats.get(chat.conversationId).otherUsers.first()

      let newItems: boolean = false

      dbRef.on('child_added', function(message) {
        console.log(message.val().user._id)
        console.log(myId)
        // TODO: prevent duplicates while still updating when someone else chats...

        // this line will prevent duplicates but doesn't update when someone else chats
        if (!newItems || message.val().user._id == 1) return

        // this line does vice versa
        // if (!newItems || message.val().user._id == myId) return

        // broke zach convo (convoId == 2) when i put 'message as any' instead of 'new Array(message.val())',
        // message was 'letsgo'
        receiveMessagesFunc(chat.conversationId, new Array(message.val()))
      })
      dbRef.once('value', function(messages) {
        newItems = true
      })
    }
  }

  componentWillUnmount() {

  }

  public render() {
    return (
      <View style={[styles.container]}>
        <FlatList
          data={this.props.chats.toArray()}
          renderItem={this.renderItem}
          keyExtractor={(item: Conversation) => item.conversationId}
        />
      </View>
    )
  }

  private openChatScreen = (conversationId: string) => {
    const user = this.props.chats.get(conversationId).otherUsers.first()
    this.props.navigation.navigate('Chat', {
      name: user.name,
      id: user._id,
      avatar: user.avatar,
      conversationId,
    })
  }

  private renderItem = ({item}: {item: Conversation}) => {
    return (
      <MatchesListItem
        name={item.otherUsers.first().name.split(' ')[0]}
        onPress={() => this.openChatScreen(item.conversationId)}
        lastMessage={item.mostRecentMessage}
        messageRead={!item.messagesUnread}
        avatar={item.otherUsers.first().avatar}
      />
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    chats: state.matches.chats,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    sendMessages: (conversationId: string, messages: Message[]) => dispatch(sendMessages(conversationId, messages)),
    receiveMessages: (conversationId: string, messages: Message[]) => dispatch(receiveMessages(conversationId, messages)),
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
