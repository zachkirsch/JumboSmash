import { Map } from 'immutable'
import React, { PureComponent } from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'
import { connect, Dispatch } from 'react-redux'
import { AuthedRouter, LoginRouter, CodeOfConductScreen, CountdownScreen } from './components'
import { RootState } from './redux'
import { Conversation, receiveMessages } from './services/matches'
import { IChatMessage } from 'react-native-gifted-chat'
import { ChatService } from './services/firebase'
import { attemptConnectToFirebase } from './services/firebase'
import firebase from 'react-native-firebase'
import MatchPopUp from './MatchPopUp'

interface StateProps {
  isLoggedIn: boolean
  codeOfConductAccepted: boolean
  networkRequestInProgress: boolean
  chats: Map<string, Conversation>
  firebaseToken: string
}

interface DispatchProps {
  attemptConnectToFirebase: (token: string) => void
  receiveMessages: (conversationId: string, messages: IChatMessage[]) => void
}

type Props = StateProps & DispatchProps

const SHOULD_SHOW_COUNTDOWN = false

class RehydratedApp extends PureComponent<Props, {}> {

  private onUserChanged: () => void

  componentDidMount() {
    this.props.chats.keySeq().forEach(ChatService.listenForNewChats)
    this.onUserChanged = firebase.auth().onUserChanged(() => {
      if (!firebase.auth().currentUser && this.props.isLoggedIn) {
        this.props.attemptConnectToFirebase(this.props.firebaseToken)
      }
    })
  }

  componentWillUnmount() {
    ChatService.stopListeningForNewChats()
    this.onUserChanged()
  }

  public render() {
    return (
      <View style={styles.container}>
        <StatusBar networkActivityIndicatorVisible={this.props.networkRequestInProgress} />
        {this.renderScreen()}
        <View style={StyleSheet.absoluteFill}>
          <MatchPopUp
            myAvatar={'https://scontent.fzty2-1.fna.fbcdn.net/v/t31.0-8/17039378_10212402239837389_6623819361607561120_o.jpg?_nc_cat=0&_nc_eui2=v1%3AAeGrMD1dIxJNQkk-jGY1Bm-JqUqNTkuNoCcZmEHv5Z68u0_wDQvfg1ojwJ7mFaXKKyW3rE6F81WydXHMlZAaFpjlZDJhJo9rBW41-QX1KTGHpg&oh=aba1aa054a9dca11ab5ac4cf78878b62&oe=5B604D66'}
            matchAvatar={'https://scontent.fzty2-1.fna.fbcdn.net/v/t31.0-8/17039378_10212402239837389_6623819361607561120_o.jpg?_nc_cat=0&_nc_eui2=v1%3AAeGrMD1dIxJNQkk-jGY1Bm-JqUqNTkuNoCcZmEHv5Z68u0_wDQvfg1ojwJ7mFaXKKyW3rE6F81WydXHMlZAaFpjlZDJhJo9rBW41-QX1KTGHpg&oh=aba1aa054a9dca11ab5ac4cf78878b62&oe=5B604D66'}
            matchName={'Zach'}/>
        </View>
      </View>
    )
  }

  private renderScreen() {
    if (SHOULD_SHOW_COUNTDOWN) {
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
    networkRequestInProgress: networkRequestInProgress(state),
    chats: state.matches.chats,
    firebaseToken: state.firebase.token.value,
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
