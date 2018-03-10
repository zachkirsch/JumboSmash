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
        isLoggedIn: !!state.auth.sessionKey,
        codeOfConductAccepted: state.coc.codeOfConductAccepted,
        rehydrated: state.redux.rehydrated,
        networkRequestInProgress: state.auth.waitingForRequestVerificationResponse ||
                                  state.auth.waitingForVerificationResponse ||
                                  state.firebase.loading,
    }
}

export default connect(mapStateToProps)(App)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
