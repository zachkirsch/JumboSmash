import { Map } from 'immutable'
import React, { PureComponent } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { GiftedChat, InputToolbarProps, MessageProps, IChatMessage } from 'react-native-gifted-chat'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../../redux'
import {
  Conversation,
  sendMessages,
  setConversationAsRead,
} from '../../../services/matches'
import { JSImage, JSText } from '../../common'
import { HeaderBar } from '../../common'
import { User } from '../../../services/swipe'
import Message from './Message'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { ActionSheetProps, connectActionSheet } from '@expo/react-native-action-sheet'
import { generateActionSheetOptions } from '../../../utils'
import InputToolbar from './InputToolbar'

interface OwnProps {
  conversationId: string,
}

interface StateProps {
  me: {
    _id: number
    name: string
  },
  chats: Map<string, Conversation>,
  allUsers: Map<number, User>,
}

interface DispatchProps {
  sendMessages: (conversationId: string, messages: IChatMessage[]) => void
  setConversationAsRead: () => void
}

type Props = ActionSheetProps<NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>>

@connectActionSheet
class ChatScreen extends PureComponent<Props, {}> {

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

    // toggle between these two depending on whether testing with fake zach or real user
    // const user = conversation.otherUsers[0]
    const user = this.props.allUsers.get(conversation.otherUsers[0])

    return (
      <View style={styles.container}>
        <HeaderBar
          renderTitle={this.renderHeaderBarTitle(user)}
          goBack={this.props.navigation.goBack}
          renderRightIcon={this.renderRightIcon}
        />
        <View style={styles.chat}>
          <GiftedChat
            messages={messages}
            renderMessage={this.renderMessage}
            renderInputToolbar={this.renderInputToolbar}
            onSend={this.onSend}
            user={this.props.me}
          />
        </View>
      </View>
    )
  }

  private renderMessage = (props: MessageProps) => {
    if (!props.currentMessage || props.currentMessage.system) {
      return <Message {...props} />
    }
    const fromUserId = props.currentMessage.user._id
    return (
      <Message
        {...props}
        fromUser={this.props.allUsers.get(fromUserId)}
      />
    )
  }

  private renderInputToolbar = (props: InputToolbarProps) => <InputToolbar {...props} />

  private renderHeaderBarTitle = (user: User) => () => (
    <View style={styles.bannerProfile}>
      <TouchableOpacity onPress={this.previewProfile(user)} style={{alignItems: 'center'}}>
        <JSImage cache source={{uri: user.images[0]}} style={styles.avatarPhoto} />
        <JSText style={styles.headerName}>{user.preferredName}</JSText>
      </TouchableOpacity>
    </View>
  )

  private renderRightIcon = () => (
    <FontAwesome
      name='ellipsis-v'
      size={30}
      color='rgb(172,203,238)'
      onPress={this.onPressEllipsis}
    />
  )

  private previewProfile = (user: User) => () => {
    this.props.navigation.navigate('ViewProfileScreen', { preview: user })
  }

  private onPressEllipsis = () => {
    const buttons = [
      {
        title: 'Block User',
      },
      {
        title: 'Report User',
      },
    ]
    const {options, callback} = generateActionSheetOptions(buttons)
    this.props.showActionSheetWithOptions!(options, callback)
  }

  private onSend = (messages: IChatMessage[] = []) => {
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
    allUsers: state.swipe.allUsers.value,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>, ownProps: Props): DispatchProps => {
  return {
    sendMessages: (conversationId: string, messages: IChatMessage[]) => {
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
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 2,
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
  headerName: {
    color: 'gray',
    textAlign: 'center',
    fontSize: 11,
  },
  inputToolbarContainer: {
    flex: 1,
    marginLeft: 12,
    marginBottom: 7,
  },
})
