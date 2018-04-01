import { Map } from 'immutable'
import React, { PureComponent } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../../redux'
import {
  Conversation,
  GiftedChatMessage,
  GiftedChatUser,
  sendMessages,
  setConversationAsRead,
} from '../../../services/matches'
import {JSText } from '../../common'
import { HeaderBar } from '../../common'
import { getFirstName } from '../../../utils'

interface OwnProps {
  conversationId: string,
}

interface StateProps {
  me: {
    _id: number
    name: string
  },
  chats: Map<string, Conversation>,
}

interface DispatchProps {
  sendMessages: (conversationId: string, messages: GiftedChatMessage[]) => void
  setConversationAsRead: () => void
}

interface State { }

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>

class ChatScreen extends PureComponent<Props, State> {

  componentDidMount() {
    this.props.setConversationAsRead()
  }

  componentWillReceiveProps(_: Props, newProps: Props) {
    if (newProps.chats) {
      if (this.getConversation(newProps).messagesUnread) {
        this.props.setConversationAsRead()
      }
    }
  }

  public render() {
    const conversation = this.getConversation()
    const messages = conversation.messages.toArray()
    const user = conversation.otherUsers.first()

    return (
      <View style={styles.container}>
        <HeaderBar renderTitle={this.renderHeaderBarTitle(user)} goBack={this.props.navigation.goBack} />
        <View style={styles.chat}>
          <GiftedChat
            messages={messages}
            onSend={this.onSend as any} /* tslint:disable-line:no-any */
            user={this.props.me}
          />
        </View>
      </View>
    )
  }

  private renderHeaderBarTitle = (user: GiftedChatUser) => () => (
    <View style={styles.bannerProfile}>
      <Image source={{uri: user.avatar}} style={styles.avatarPhoto} />
      <JSText fontSize={13}>{getFirstName(user.name)}</JSText>
    </View>
  )

  private onSend = (messages: GiftedChatMessage[] = []) => {
    this.props.sendMessages(this.getConversationId(), messages)
  }

  private getConversationId = () => {
    return this.props.navigation.state.params.conversationId
  }

  private getConversation = (props?: Props) => {
    return (props || this.props).chats.get(this.getConversationId())
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    me: {
      _id: state.profile.id,
      name: state.profile.preferredName.value,
    },
    chats: state.matches.chats,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>, ownProps: Props): DispatchProps => {
  return {
    sendMessages: (conversationId: string, messages: GiftedChatMessage[]) => {
      dispatch(sendMessages(conversationId, messages))
    },
    setConversationAsRead: () => dispatch(setConversationAsRead(ownProps.navigation.state.params.conversationId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarPhoto: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  bannerProfile: {
    marginVertical: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chat: {
    flex: 1,
    flexDirection: 'row',
  },
})
