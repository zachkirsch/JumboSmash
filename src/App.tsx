import React, { Component } from 'react'
import { connect } from 'react-redux'
import Login from './components/Login'
import Secured from './components/Secured'

interface Props {
  isLoggedIn: boolean
}

class App extends Component<Props, void> {
    render() {
        if (this.props.isLoggedIn) {
            return <Secured />
        } else {
            return <Login />
        }
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.auth.isLoggedIn
    }
}

export default connect(mapStateToProps)(App)
