import React, { PureComponent } from 'react'
import { View, StatusBar, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { RootState } from './redux'
import { CountdownScreen, CodeOfConductScreen, AuthedRouter, LoginRouter} from './components'

interface StateProps {
  isLoggedIn: boolean
  codeOfConductAccepted: boolean
  rehydrated: boolean
  networkRequestInProgress: boolean
}

type Props = StateProps

const SHOULD_SHOW_COUNTDOWN = false

class App extends PureComponent<Props, {}> {

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

export default connect(mapStateToProps)(App)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
