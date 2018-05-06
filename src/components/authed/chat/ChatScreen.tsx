import { Map } from 'immutable'
import React, { PureComponent } from 'react'
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import { GiftedChat, InputToolbarProps, MessageProps, IChatMessage } from 'react-native-gifted-chat'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect, Dispatch } from 'react-redux'
import moment from 'moment'
import { RootState } from '../../../redux'
import {
  Conversation,
  sendMessages,
  setConversationAsRead,
  ChatMessage,
} from '../../../services/matches'
import { JSImage, JSText, HeaderBar } from '../../common'
import { blockUser } from '../../../services/profile'
import { User } from '../../../services/swipe'
import Message from './Message'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { ActionSheetProps, connectActionSheet } from '@expo/react-native-action-sheet'
import { generateActionSheetOptions, reportUser } from '../../../utils'
import InputToolbar from './InputToolbar'
import { unmatch } from '../../../services/matches'

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
  sendMessages: (messages: ChatMessage[]) => void
  setConversationAsRead: () => void
  unmatch: (matchId: number) => void
  blockUser: (email: string) => void
}

type Props = ActionSheetProps<NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>>

@connectActionSheet
class ChatScreen extends PureComponent<Props, {}> {

  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      () => {
        this.props.setConversationAsRead()
      }
    )
  }

  componentWillReceiveProps(newProps: Props) {
    if (newProps.chats) {
      const conversation = this.getConversation(newProps)
      if (conversation && conversation.messagesUnread) {
        this.props.setConversationAsRead()
      }
    }
  }

  public render() {
    const conversation = this.getConversation()
    if (!conversation) {
      return null
    }
    const messages = conversation.messages.toArray()

    return (
      <View style={styles.container}>
        <HeaderBar
          renderTitle={this.renderHeaderBarTitle(this.getUser())}
          onPressLeft={this.goBack}
          renderRight={this.renderRightIcon}
          onPressRight={this.onPressEllipsis}
          containerStyle={styles.headerBar}
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

  private renderHeaderBarTitle = (user: User) => () => {
    return (
      <View style={styles.bannerProfile}>
        <TouchableOpacity onPress={this.previewProfile(user)} style={{alignItems: 'center'}}>
          <JSImage cache source={{uri: user.images[0]}} style={styles.avatarPhoto} />
          <JSText style={styles.headerName}>{user.preferredName}</JSText>
        </TouchableOpacity>
      </View>
    )
  }

  private renderRightIcon = () => (
    <FontAwesome
      name='ellipsis-v'
      size={30}
      color='rgb(172,203,238)'
      style={styles.rightIcon}
    />
  )

  private goBack = () => this.props.navigation.goBack()

  private previewProfile = (user: User) => () => {
    this.props.navigation.navigate('ViewProfileScreen', { type: 'other', userId: user.id })
  }

  private onPressEllipsis = () => {
    const buttons = [
      {
        title: 'Block User',
        onPress: this.confirm('block', () => {
          this.goBack()
          this.props.blockUser(this.getUser().email)
        }),
      },
      {
        title: 'Report User',
        onPress: () => reportUser(this.getUser()),
      },
      {
        title: 'Unmatch',
        onPress: this.confirm('unmatch', () => {
          this.goBack()
          const conversation = this.getConversation()
          if (conversation) {
            this.props.unmatch(conversation.matchId)
          }
        }),
      },
    ]
    const {options, callback} = generateActionSheetOptions(buttons)
    this.props.showActionSheetWithOptions!(options, callback)
  }

  private confirm = (action: 'block' | 'unmatch', onConfirm: () => void) => () => {
    Alert.alert(
      '',
      `Are you sure you want to ${action} ${this.getUser().preferredName}?`,
      [
        {text: 'No', style: 'cancel'},
        {text: 'Yes', style: 'destructive', onPress: onConfirm},
      ]
    )
  }

  private onSend = (messages: IChatMessage[] = []) => {
    this.props.sendMessages(messages.map(message => ({
      ...message,
      createdAt: moment(message.createdAt).valueOf(),
    })))
  }

  private getConversationId = () => this.props.navigation.state.params.conversationId

  private getConversation = (props?: Props) => {
    return (props || this.props).chats.get(this.getConversationId())
  }

  private getUser = () => this.props.allUsers.get(this.getConversation().otherUsers[0])
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
    sendMessages: (messages: ChatMessage[]) => {
      dispatch(sendMessages( ownProps.navigation.state.params.conversationId, messages))
    },
    setConversationAsRead: () => dispatch(setConversationAsRead(ownProps.navigation.state.params.conversationId)),
    unmatch: (matchId: number) => dispatch(unmatch(
      matchId,
      ownProps.navigation.state.params.conversationId
    )),
    blockUser: (email: string) => dispatch(blockUser(email)),
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
    marginTop: 2,
    marginBottom: 5,
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
    fontSize: 12,
  },
  inputToolbarContainer: {
    flex: 1,
    marginLeft: 12,
    marginBottom: 7,
  },
  headerBar: {
    height: 73,
  },
  rightIcon: {
    paddingRight: 10,
  },
})
