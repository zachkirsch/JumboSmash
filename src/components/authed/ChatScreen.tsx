import React, { PureComponent } from 'react'
import { View, StyleSheet, Image, TouchableHighlight } from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { GiftedChat } from 'react-native-gifted-chat'
import { Map } from 'immutable'
import JSText from '../generic/JSText'
import {scale} from '../generic'
import { default as Ionicons } from 'react-native-vector-icons/Ionicons'
import { Conversation, Message, sendMessages } from '../../services/matches'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../redux'

interface OwnProps {
  name: string,
  id: string,
  avatar: string,
  conversationId: string,
}

interface StateProps {
  chats: Map<string, Conversation>,
}

interface DispatchProps {
  sendMessages: (conversationId: string, messages: Message[]) => void
}

interface State { }

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>

class ChatScreen extends PureComponent<Props, State> {

  public render() {
    const conversationId: string = this.props.navigation.state.params.conversationId
    const messages = this.props.chats.get(conversationId).messages.toArray()

    return (
      <View style={[styles.container, styles.center]}>
        <View style={styles.topBanner}>
          <TouchableHighlight onPress={() => this.props.navigation.goBack()} style={styles.backButton}>
            <Ionicons name='ios-arrow-back' size={scale(30)} color='rgb(172,203,238)' />
          </TouchableHighlight>
          <View style={styles.bannerProfile}>
            <Image source={{uri: this.props.navigation.state.params.avatar}} style={styles.avatarPhoto} />
            <JSText>{this.props.navigation.state.params.name.split(' ')[0]}</JSText>
          </View>
          <View style={styles.buttonBalancer} />
        </View>
        <View style={styles.chat}>
          <GiftedChat
            messages={messages}
            onSend={this.onSend.bind(this)}
            user={{
              _id: 6,
              name: 'Max Bernstein',
            }}
          />
        </View>
      </View>
    )
  }

  private onSend<MessageType>(messages: MessageType[] = []) {
    /* tslint:disable-next-line:no-any */
    this.props.sendMessages(this.props.navigation.state.params.conversationId, messages as any)
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

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flexDirection: 'column',
  },
  avatarPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  topBanner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d6d7da',
    shadowOffset: { width: 10, height: 10 },
    shadowColor: 'black',
    shadowOpacity: .1,
    shadowRadius: 20,
    elevation: 3,
    // background color must be set
    backgroundColor : '#0000', // invisible color
  },
  bannerProfile: {
    flex: 4,
    flexDirection: 'column',
    alignItems: 'center',
  },
  backButton: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttonBalancer: {
    flex: 1,
    flexDirection: 'column',
  },
  chat: {
    flex: 5,
    flexDirection: 'row',
  },
})
