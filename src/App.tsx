import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { RootState } from './redux'
import { WelcomeScreen, CodeOfConductScreen, AuthedRouter } from './components'

interface StateProps {
  isLoggedIn: boolean
  codeOfConductAccepted: boolean
  rehydrated: boolean
}

type Props = StateProps

class App extends PureComponent<Props, {}> {

  public render() {
    if (!this.props.rehydrated) {
      // TODO: replace with loading screen
      return null /* tslint:disable-line:no-null-keyword */
    } else if (!this.props.isLoggedIn) {
      return <WelcomeScreen />
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
    }
}

export default connect(mapStateToProps)(App)
