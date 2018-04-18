import { Map } from 'immutable'
import React, { PureComponent } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import {Composer, GiftedChat, InputToolbar, Send} from 'react-native-gifted-chat'
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

import SlackMessage from './SlackMessage'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { ActionSheetProps, connectActionSheet } from '@expo/react-native-action-sheet'
import { generateActionSheetOptions } from '../../../utils'
import LinearGradient from 'react-native-linear-gradient'


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

type Props = ActionSheetProps<NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>>

const buttons = [
  {
    title: 'Block User',
  },
  {
    title: 'Report User',
  },
]
const {options, callback} = generateActionSheetOptions(buttons)

@connectActionSheet
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

  private renderMessage(props) {
    const { currentMessage: { text: currText } } = props;

    let messageTextStyle;

    return (
      <SlackMessage {...props} messageTextStyle={messageTextStyle} />
    );
  }

  private renderInputToolbar = (props) => {
    return (
      <View
        style={[styles.tester, { position: 'absolute' }]}
      >
        <View style={styles.primary}>
          {this.renderComposer(props)}
          {this.renderSend(props)}
        </View>
      </View>
    )
  }

  private renderComposer = (props) => {
    return (
      <LinearGradient
          colors={[
            `rgba(232, 240, 252, ${0.35})`,
            `rgba(212, 214, 219, ${0.35})`,
          ]}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 1}}
          locations={[0, 1]}
          style={styles.gradient}
        >
        <Composer
          {...props}
          placeholder={'Type to impress...'}

        >
        </Composer>
      </LinearGradient>
    )
  }

  private renderSend = (props) => {
    return (
      <Send
        {...props}
      >
        <JSText style={styles.sendButton}>
          Send
        </JSText>
      </Send>
    )
  }

  public render() {
    const conversation = this.getConversation()
    const messages = conversation.messages.toArray()
    const user = conversation.otherUsers.first()

    return (
      <View style={styles.container}>
        <HeaderBar renderTitle={this.renderHeaderBarTitle(user)}
                   goBack={this.props.navigation.goBack}
                   renderRightIcon={this.renderRightIcon()}/>
        <View style={styles.chat}>
          <GiftedChat
            messages={messages}
            renderMessage={this.renderMessage}
            onSend={this.onSend as any} /* tslint:disable-line:no-any */
            // placeholder={'Type to impress!'}
            user={this.props.me}
            renderInputToolbar={this.renderInputToolbar}
            // renderComposer={this.renderComposer}
            // renderSend={this.renderSend}
            // containerStyle={{backgroundColor: 'red',}}
          />
        </View>
      </View>
    )
  }

  private renderHeaderBarTitle = (user: GiftedChatUser) => () => (
    <View style={styles.bannerProfile}>
      <TouchableOpacity onPress={() => this.props.navigation.navigate('ViewProfileScreen', {
        preview: {
          id: user._id,
          preferredName: user.name,
          bio: user.bio,
          images: ['https://scontent.fzty2-1.fna.fbcdn.net/v/t31.0-8/17039378_10212402239837389_6623819361607561120_o.jpg?_nc_cat=0&oh=841d1ac8113db7793041e165a9a1094d&oe=5B604D66',
          'https://scontent.fzty2-1.fna.fbcdn.net/v/t1.0-9/1915137_1203819941963_756538_n.jpg?_nc_cat=0&oh=4c744979964530b033e1e6ca66c7a2cf&oe=5B71A02A'],
          tags: ['tag1','tag2'],
          // images: user.images,
          // tags: user.tags,
        },
      })}>
        <Image source={{uri: user.avatar}} style={styles.avatarPhoto} />
        <JSText fontSize={11} style={styles.headerName}>{getFirstName(user.name)}</JSText>
      </TouchableOpacity>
      {/*<View style={styles.reportBlockButton}>*/}
        {/*<TouchableWithoutFeedback>*/}
          {/*<JSText fontSize={11} style={styles.headerName}>{getFirstName(user.name)}</JSText>*/}
        {/*</TouchableWithoutFeedback>*/}
      {/*</View>*/}
    </View>
  )

  private renderRightIcon = () => () => (
    <FontAwesome name='ellipsis-v'
                 size={30}
                 color='rgb(172,203,238)'
                 onPress={() => this.props.showActionSheetWithOptions(options, callback)}/>
)

  // private renderIcon = () => () => (
  //   <View style={styles.reportBlockButton}>
  //     <TouchableOpacity>
  //       <Ionicons name='ios-arrow-back' size={30} color='rgb(172,203,238)' />
  //     </TouchableOpacity>
  //   </View>
  // )
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
    width: 40,
    height: 40,
    borderRadius: 20,
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
  },
  gradient: {
    borderRadius: 30,
    flex: 4,
    marginHorizontal: 8,
    marginVertical: 8,
  },
  sendButton: {
    color: 'gray',
    flex: 0,
    marginBottom: 24,
    marginRight: 8,
  },
  tester: {
    backgroundColor: 'white',
    bottom: 0,
    left: 0,
    right: 0,
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  // reportBlockButton: {
  //   flex: 1,
  //   flexDirection: 'column',
  // }
})
