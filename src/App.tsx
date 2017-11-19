import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { RootState } from './redux'
import { CodeofConductScreen, Navigator } from './components'//LoginScreen

interface StateProps {
  isLoggedIn: boolean
}

type Props = StateProps

class App extends PureComponent<Props, {}> {

  public render() {
    if (this.props.isLoggedIn) {
      return <Navigator />
    } else {
      return <CodeofConductScreen />
    }
  }

}

const mapStateToProps = (state: RootState): StateProps => {
    return {
        isLoggedIn: state.auth.isLoggedIn
    }
}

export default connect(mapStateToProps)(App)
