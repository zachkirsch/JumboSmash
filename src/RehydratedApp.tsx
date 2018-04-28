import { Map } from 'immutable'
import React, { PureComponent } from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'
import { connect, Dispatch } from 'react-redux'
import { NavigationContainer } from 'react-navigation'
import { generateLoginRouter, generatePostLoginRouter, CountdownScreen, AuthedRouter } from './components'
import { RootState } from './redux'
import { Conversation, receiveMessages } from './services/matches'
import { IChatMessage } from 'react-native-gifted-chat'
import { ChatService } from './services/firebase'
import { attemptConnectToFirebase } from './services/firebase'
import { AuthState } from './services/auth'
import firebase from 'react-native-firebase'

interface StateProps {
  authState: AuthState
  networkRequestInProgress: boolean
  chats: Map<string, Conversation>
  firebaseToken: string
  classYear: number
  profileSetUp: boolean
}

interface DispatchProps {
  attemptConnectToFirebase: (token: string) => void
  receiveMessages: (conversationId: string, messages: IChatMessage[]) => void
}

type Props = StateProps & DispatchProps

const SHOULD_SHOW_COUNTDOWN = false

class RehydratedApp extends PureComponent<Props, {}> {

  private onUserChanged: () => void
  private loginRouter?: NavigationContainer
  private postLoginRouter?: NavigationContainer

  componentWillMount() {
  //  this.LoginRouter =
  }

  componentDidMount() {
    this.onUserChanged = firebase.auth().onUserChanged(() => {
      if (!firebase.auth().currentUser && this.props.authState.isLoggedIn) {
        this.props.attemptConnectToFirebase(this.props.firebaseToken)
      }
    })
  }

  componentWillUnmount() {
    ChatService.stopListeningForNewChats()
    this.onUserChanged()
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.authState.isLoggedIn && !nextProps.authState.isLoggedIn) {
      this.loginRouter = undefined
      this.postLoginRouter = undefined
    }
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
    if (SHOULD_SHOW_COUNTDOWN) {
      return <CountdownScreen />
    } else if (!this.props.authState.isLoggedIn) {
      if (!this.loginRouter) {
        this.loginRouter = generateLoginRouter()
      }
      return <this.loginRouter />
    } else if (this.shouldShowPostLoginScreens()) {
      if (!this.postLoginRouter) {
        this.postLoginRouter = generatePostLoginRouter()
      }
      return <this.postLoginRouter screenProps={{setupMode: true}}/>
    } else {
      return <AuthedRouter />
    }
  }

  private shouldShowPostLoginScreens = () => !this.props.authState.codeOfConductAccepted
    || !this.props.authState.tutorialFinished
    || this.props.classYear !== 18 && !this.props.authState.nearTufts
    || !this.props.profileSetUp
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    authState: state.auth,
    networkRequestInProgress: networkRequestInProgress(state),
    chats: state.matches.chats,
    firebaseToken: state.firebase.token.value,
    classYear: state.profile.classYear,
    profileSetUp: state.profile.images.filter(i => !!i && !!i.value.uri).size > 0,
  }
}

// TODO: update with other ways of network requests
const networkRequestInProgress = (state: RootState) => {
  return state.auth.waitingForRequestVerificationResponse
  || state.auth.waitingForVerificationResponse
  || state.firebase.token.loading
  || state.profile.preferredName.loading
  || state.profile.major.loading
  || state.profile.bio.loading
  || !!state.profile.images.find(image => !!image && image.loading)
  || state.profile.tags.loading
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    receiveMessages: (conversationId: string, messages: IChatMessage[]) => {
      dispatch(receiveMessages(conversationId, messages))
    },
    attemptConnectToFirebase: (token: string) => dispatch(attemptConnectToFirebase(token)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RehydratedApp)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
