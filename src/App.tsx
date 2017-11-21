import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { RootState } from './redux'
import { WelcomeScreen, Navigator } from './components'

interface StateProps {
  isLoggedIn: boolean
}

type Props = StateProps

class App extends PureComponent<Props, {}> {

  public render() {
    if (!this.props.isLoggedIn) {
      return <WelcomeScreen />
    } else {
      return <Navigator />
    }
  }

}

const mapStateToProps = (state: RootState): StateProps => {
    return {
        isLoggedIn: state.auth.isLoggedIn,
    }
}

export default connect(mapStateToProps)(App)
