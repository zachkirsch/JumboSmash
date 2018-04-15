import { Map } from 'immutable'
import React, { PureComponent } from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'
import { connect, Dispatch } from 'react-redux'
import { AuthedRouter, LoginRouter, CodeOfConductScreen, CountdownScreen, TutorialScreen, SwipeScreen } from './components'
import { RootState } from './redux'
import { getRefToChatMessages } from './services/firebase'
import { Conversation, GiftedChatMessage, receiveMessages } from './services/matches'
import { finishTutorial } from './services/tutorial'

interface StateProps {
  isLoggedIn: boolean
  codeOfConductAccepted: boolean
  rehydrated: boolean
  networkRequestInProgress: boolean
  chats: Map<string, Conversation>
  finishedTutorial: boolean
}

interface DispatchProps {
  receiveMessages: (conversationId: string, messages: GiftedChatMessage[]) => void
  finishTutorial: () => void
}

type Props = StateProps & DispatchProps

const SHOULD_SHOW_COUNTDOWN = false
const TUTORIAL_DONE = false

class App extends PureComponent<Props, {}> {

  private conversationIds: string[] = []

  componentDidMount() {
    this.conversationIds = this.props.chats.keySeq().toArray()
    this.conversationIds.forEach((conversationId) => {
      const dbRef = getRefToChatMessages(conversationId)
      dbRef.on('child_added', (firebaseMessage) => {
        if (firebaseMessage === null) {
          return
        }
        const message: GiftedChatMessage = {
          ...firebaseMessage.val(),
          createdAt: new Date(firebaseMessage.val().createdAt), // convert firebase's number to Date
        }
        this.props.receiveMessages(conversationId, [message])
      })
    })
  }

  componentWillUnmount() {
    this.conversationIds.forEach((conversationId) => {
      const dbRef = getRefToChatMessages(conversationId)
      dbRef.off('child_added')
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
      return null
    } else if (SHOULD_SHOW_COUNTDOWN) {
      return <CountdownScreen />
    } else if (!this.props.isLoggedIn) {
      return <LoginRouter />
    } else if (!this.props.codeOfConductAccepted) {
      return <CodeOfConductScreen />
    } else if (!this.props.finishedTutorial){
      return <TutorialScreen finishTutorial={this.props.finishTutorial}/>
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
    finishedTutorial: state.tutorial.finished,
  }
}

const networkRequestInProgress = (state: RootState) => {
  return state.auth.waitingForRequestVerificationResponse
  || state.auth.waitingForVerificationResponse
  || state.firebase.token.loading
  || state.profile.preferredName.loading
  || state.profile.major.loading
  || state.profile.bio.loading
  || state.profile.images.find((image) => image.loading) !== undefined
  || state.profile.tags.loading
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    receiveMessages: (conversationId: string, messages: GiftedChatMessage[]) => {
      dispatch(receiveMessages(conversationId, messages))
    },
    finishTutorial: () => dispatch(finishTutorial()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
