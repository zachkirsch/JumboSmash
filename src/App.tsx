import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { RootState } from './redux'
import { WelcomeScreen, CodeOfConductScreen, AuthedRouter, ProfileScreen } from './components'

interface StateProps {
  isLoggedIn: boolean,
  codeOfConductAccepted: boolean
}

type Props = StateProps

class App extends PureComponent<Props, {}> {

  public render() {
    if (!this.props.isLoggedIn) {
      return <ProfileScreen />
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
    }
}

export default connect(mapStateToProps)(App)
