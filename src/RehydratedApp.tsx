import { Map } from 'immutable'
import React, { PureComponent } from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'
import { connect, Dispatch } from 'react-redux'
import { NavigationContainer } from 'react-navigation'
import {
  generateLoginRouter,
  generatePostLoginRouter,
  AuthedRouter,
  InAppNotificationBanner,
} from './components'
import { RootState } from './redux'
import { Conversation, receiveMessages } from './services/matches'
import { IChatMessage } from 'react-native-gifted-chat'
import { ChatService } from './services/firebase'
import { attemptConnectToFirebase } from './services/firebase'
import { NavigationService } from './services/navigation'
import { dismissMatchPopup, MatchPopupSettings } from './services/matches'
import { AuthState } from './services/auth'
import firebase from 'react-native-firebase'
import { InAppNotification, deleteInAppNotification } from './services/notifications'
import MatchPopUp from './MatchPopUp'

interface StateProps {
  authState: AuthState
  networkRequestInProgress: boolean
  chats: Map<string, Conversation>
  firebaseToken: string
  classYear: number
  profileSetUp: boolean
  inAppNotifications: InAppNotification[]
  matchPopup: MatchPopupSettings
  myAvatar: string
}

interface DispatchProps {
  attemptConnectToFirebase: (token: string) => void
  receiveMessages: (conversationId: string, messages: IChatMessage[]) => void
  deleteInAppNotification: (id: number) => void
  dismissMatchPopup: () => void
}

type Props = StateProps & DispatchProps

class RehydratedApp extends PureComponent<Props, {}> {

  private onUserChanged: () => void
  private loginRouter?: NavigationContainer
  private postLoginRouter?: NavigationContainer

  componentDidMount() {
    // navigator.geolocation.getCurrentPosition(success => console.log(success), error => console.log(error))

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
        {this.renderMatchPopup()}
        {this.renderNotifications()}
      </View>
    )
  }

  private renderScreen() {
    if (this.shouldShowLoginScreens()) {
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
      return <AuthedRouter ref={ref => NavigationService.setRouter(ref)}/>
    }
  }

  private renderMatchPopup = () => {
    if (!this.props.matchPopup.shouldShow) {
      return null
    }
    return (
        <MatchPopUp
          myAvatar={this.props.myAvatar}
          matchAvatar={this.props.matchPopup.match.otherUsers[0].images[0].url}
          matchName={this.props.matchPopup.match.otherUsers[0].preferred_name || 'someone'}
          onPressStartChat={this.onPressStartChat}
          onDismiss={this.props.dismissMatchPopup}
        />
    )
  }

  private onPressStartChat = () => {
    if (!this.props.matchPopup.shouldShow) {
      return
    }
    this.props.dismissMatchPopup()
    NavigationService.openChat(this.props.matchPopup.match.conversationId)
  }

  private renderNotifications = () => {
    if (this.shouldShowLoginScreens() || this.shouldShowPostLoginScreens()) {
      return null
    }
    return this.props.inAppNotifications.map((notification, i) => {
      return (
        <InAppNotificationBanner
          key={i}
          deleteNotification={this.deleteNotification(notification)}
          engageNotification={this.openChat(notification)}
          notification={notification}
        />
      )
    })
  }

  private shouldShowLoginScreens = () => !this.props.authState.isLoggedIn

  private deleteNotification = (notification: InAppNotification) => () => {
    this.props.deleteInAppNotification(notification.id)
  }

  private openChat = (notification: InAppNotification) => () => {
    NavigationService.openChat(notification.conversationId)
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
    inAppNotifications: state.notifications.inAppNotifications.toArray(),
    myAvatar: state.profile.images.first() ? state.profile.images.first().value.uri : '',
    matchPopup: state.matches.matchPopup,
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
  || state.swipe.allUsers.loading
  || state.swipe.swipableUsers.loading
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    receiveMessages: (conversationId: string, messages: IChatMessage[]) => {
      dispatch(receiveMessages(conversationId, messages))
    },
    attemptConnectToFirebase: (token: string) => dispatch(attemptConnectToFirebase(token)),
    deleteInAppNotification: (id: number) => dispatch(deleteInAppNotification(id)),
    dismissMatchPopup: () => dispatch(dismissMatchPopup()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RehydratedApp)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
