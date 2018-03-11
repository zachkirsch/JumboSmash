import React, { PureComponent } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { Map } from 'immutable'
import MatchesListItem from './MatchesListItem'
import { Conversation, Message, sendMessages } from '../../services/matches'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../redux'

interface State { }

interface OwnProps { }

interface StateProps {
  chats: Map<string, Conversation>,
}

interface DispatchProps {
  sendMessages: (conversationId: string, messages: Message[]) => void
}

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>

class MatchesList extends PureComponent<Props, State> {
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
      profilePic: user.avatar,
      conversationId,
    })
  }

  private renderItem = ({item}: {item: Conversation}) => {
    return (
      <MatchesListItem
        name={item.otherUsers.first().name.split(' ')[0]}
        onPress={() => this.openChatScreen(item.conversationId)}
        lastMessage={item.mostRecentMessage}
        messageRead={true}
        profilePic={item.otherUsers.first().avatar}
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
