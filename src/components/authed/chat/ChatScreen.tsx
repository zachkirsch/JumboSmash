import { Map } from 'immutable'
import React, { PureComponent } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../../redux'
import { Conversation, GiftedChatMessage, GiftedChatUser, sendMessages } from '../../../services/matches'
import {JSText } from '../../common'
import { HeaderBar } from '../../common'
import { getFirstName } from '../../utils'

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
}

interface State { }

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>

class ChatScreen extends PureComponent<Props, State> {

  public render() {
    const conversationId: string = this.props.navigation.state.params.conversationId
    const messages = this.props.chats.get(conversationId).messages.toArray()
    const user = this.props.chats.get(conversationId).otherUsers.first()

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
    this.props.sendMessages(this.props.navigation.state.params.conversationId, messages)
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

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    sendMessages: (conversationId: string, messages: GiftedChatMessage[]) => {
      dispatch(sendMessages(conversationId, messages))
    },
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
