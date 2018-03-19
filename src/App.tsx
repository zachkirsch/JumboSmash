import React, { PureComponent } from 'react'
import { View, StatusBar, StyleSheet } from 'react-native'
import { connect, Dispatch } from 'react-redux'
import { Map } from 'immutable'
import { RootState } from './redux'
import { CountdownScreen, CodeOfConductScreen, AuthedRouter, LoginRouter} from './components'
import { firebase } from './services/firebase'
import { Conversation, GiftedChatMessage, receiveMessages } from './services/matches'

interface StateProps {
  isLoggedIn: boolean
  codeOfConductAccepted: boolean
  rehydrated: boolean
  networkRequestInProgress: boolean
  chats: Map<string, Conversation>
}

interface DispatchProps {
  receiveMessages: (conversationId: string, messages: GiftedChatMessage[]) => void
}

type Props = StateProps & DispatchProps

const SHOULD_SHOW_COUNTDOWN = false

class App extends PureComponent<Props, {}> {

  componentDidMount() {
    const path = 'messages/'
    this.props.chats.keySeq().forEach(conversationId => {
      const dbRef = firebase.database().ref(path.concat(conversationId))
      dbRef.on('child_added', (firebaseMessage) => {
        const message: GiftedChatMessage = {
          ...firebaseMessage.val(),
          createdAt: new Date(firebaseMessage.val().createdAt), // convert firebase's number to Date
        }
        this.props.receiveMessages(conversationId, [message])
      })
    })
  }

  public render() {
    return (
      <View style={styles.container}>
        <StatusBar networkActivityIndicatorVisible={this.props.networkRequestInProgress} />
        {this.renderScreen()}
      </View>
    )
  }

  private renderScreen() {
    if (!this.props.rehydrated) {
      // TODO: replace with splash screen
      return null /* tslint:disable-line:no-null-keyword */
    } else if (SHOULD_SHOW_COUNTDOWN) {
      return <CountdownScreen />
    } else if (!this.props.isLoggedIn) {
      return <LoginRouter />
    } else if (!this.props.codeOfConductAccepted) {
      return <CodeOfConductScreen />
    } else {
      return <AuthedRouter />
    }
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    codeOfConductAccepted: state.coc.codeOfConductAccepted,
    rehydrated: state.redux.rehydrated,
    networkRequestInProgress: networkRequestInProgress(state),
    chats: state.matches.chats,
  }
}

const networkRequestInProgress = (state: RootState) => {
  return state.auth.waitingForRequestVerificationResponse
  || state.auth.waitingForVerificationResponse
  || state.firebase.token.loading
  || state.profile.preferredName.loading
  || state.profile.major.loading
  || state.profile.bio.loading
  || state.profile.images.loading
  || state.profile.tags.loading
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    receiveMessages: (conversationId: string, messages: GiftedChatMessage[]) => {
      dispatch(receiveMessages(conversationId, messages))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
