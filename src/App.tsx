import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { RootState } from './redux'
import { WelcomeScreen, Navigator, CodeOfConductScreen } from './components'

interface StateProps {
  isLoggedIn: boolean,
  isNewUser: boolean,
  codeOfConductAccepted: boolean
}

type Props = StateProps

class App extends PureComponent<Props, {}> {

  public render() {
    if (!this.props.isLoggedIn) {
      return <WelcomeScreen />
    } else if (this.props.isNewUser && !this.props.codeOfConductAccepted) {
      return <CodeOfConductScreen />
    } else {
      return <Navigator />
    }
  }

}

const mapStateToProps = (state: RootState): StateProps => {
    return {
        isLoggedIn: state.auth.isLoggedIn,
        isNewUser: state.auth.isNewUser,
        codeOfConductAccepted: state.coc.codeOfConductAccepted,
    }
}

export default connect(mapStateToProps)(App)
