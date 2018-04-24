import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { RootState } from './redux'
import RehydratedApp from './RehydratedApp'

interface StateProps {
  rehydrated: boolean
}

type Props = StateProps

class App extends PureComponent<Props, {}> {

  public render() {

    if (!this.props.rehydrated) {
      return null
    }

    return <RehydratedApp />
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    rehydrated: state.redux.rehydrated,
  }
}

export default connect(mapStateToProps)(App)
