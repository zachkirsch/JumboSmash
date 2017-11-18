import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { RootState } from './redux'
import { LoginScreen, MainTabNavigator } from './components'

interface StateProps {
  isLoggedIn: boolean
}

type Props = StateProps

class App extends PureComponent<Props, {}> {

  public render() {
    if (this.props.isLoggedIn) {
      return <MainTabNavigator />
    } else {
      return <LoginScreen />
    }
  }

}

const mapStateToProps = (state: RootState): StateProps => {
    return {
        isLoggedIn: state.auth.isLoggedIn
    }
}

export default connect(mapStateToProps)(App)
