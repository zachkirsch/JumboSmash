import React, { PureComponent } from 'react'
import { Text, View, Button, StyleSheet, Image, TouchableHighlight } from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { GiftedChat } from 'react-native-gifted-chat'
import JSText from '../generic/JSText'
import {scale} from '../generic'
import { default as Ionicons } from 'react-native-vector-icons/Ionicons'
import { firebase } from '../../services/firebase'
import { MatchesState, Message, sendMessages } from '../../services/matches'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../redux'

interface Chat {
  id: number
  time: number
  isSender: boolean,
  read: boolean,
  text: string
}

interface OwnProps {
  name: string,
  id: string,
  profilePic: string,
  messages: Chat[]
}

interface StateProps {
  matches: {
    [userId: number]: {
      user: User
      messages: Message[]
    }
  }
}

interface DispatchProps {
  sendMessages: (toUser: number, messages: Message[]) => void
}

interface State {
  messages: Message[]
}

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>

class ChatScreen extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      messages: [],
    }

    const path = 'messages/'.concat('1234')
    this._pushMessageRef = firebase.database().ref(path)
    this._messagesRef = this._pushMessageRef.orderByChild('date').limitToLast(12)
    this._messagesRef.on('child_added', function(snapshot) {
      console.log(snapshot.val())
    })
    // console.log(this._messagesRef.)
  }

  componentWillMount() {
    // let temp: Message[] = this._messagesRef.on('child_added', function(message) {
    //   return {
    //     _id: message.val()._id,
    //     text: message.val().text,
    //     createdAt: new Date(),
    //     user: {
    //       _id: message.val().user._id,
    //       name: message.val().user.name,
    //       avatar: message.val().user.avatar,
    //     },
    //     system: false,
    //   }
    // })
    let temp: Message[] = this.props.navigation.state.params.messages.map((message) => {
      return {
        _id: message.id,
        text: message.text,
        createdAt: new Date(message.time),
        user: {
          _id: message.isSender ? 1 : 0,
          name: message.isSender ? 'Max Bernstein' : this.props.navigation.state.params.name,
          avatar: this.props.navigation.state.params.profilePic,
        },
        system: false,
      }
    })
    this.setState({
      messages: temp,
    })
  }

  public render() {
    return (
      <View style={[styles.container, styles.center]}>
        <View style={styles.topBanner}>
          <TouchableHighlight onPress={() => this.props.navigation.goBack()} style={styles.backButton}>
            <Ionicons name='ios-arrow-back' size={scale(30)} color='rgb(172,203,238)' />
          </TouchableHighlight>
          <View style={styles.bannerProfile}>
            <Image source={{uri: this.props.navigation.state.params.profilePic}} style={styles.avatarPhoto} />
            <JSText>{this.props.navigation.state.params.name.split(' ')[0]}</JSText>
          </View>
          <View style={styles.buttonBalancer} />
        </View>
        <View style={styles.chat}>
          <GiftedChat
            messages={this.state.messages}
            onSend={this.onSend}
            user={{
              _id: 1,
              name: 'Max Bernstein',
            }}
          />
        </View>
      </View>
    )
  }

  private onSend = (messages: Message[] = []) => {
    this.setState((previousState: State) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
    for (let message of messages) {
      this._pushMessageRef.push({
        _id: message._id,
        text: message.text,
        user: {
          _id: this.props.navigation.state.params.id,
          name: this.props.navigation.state.params.name,
          avatar: this.props.navigation.state.params.profilePic,
        },
        date: new Date().getTime(),
        read: false,
      })
    }
    //TODO
    this.props.sendMessages(2, messages)
  }
}
const mapStateToProps = (state: RootState): StateProps => {
  return {
    matches: state.matches
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    sendMessages: (toUser: number, messages: Message[]) => dispatch(sendMessages(toUser, messages)),
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