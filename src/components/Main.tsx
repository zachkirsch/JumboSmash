import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Login from './Login'
import Secured from './Secured'
import { RootState } from '../services'

interface StateProps {
  isLoggedIn: boolean
}

type Props = StateProps

class Main extends PureComponent<Props, {}> {
    render() {
        if (this.props.isLoggedIn) {
          return <Secured />
        } else {
          return <Login />
        }
    }
}

const mapStateToProps = (state: RootState): StateProps => {
    return {
        isLoggedIn: state.auth.isLoggedIn
    }
}

export default connect(mapStateToProps)(Main)
