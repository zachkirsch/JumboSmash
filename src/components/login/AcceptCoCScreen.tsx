import React, { PureComponent } from 'react'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../redux'
import { acceptCoC } from '../../services/auth'
import CodeOfConductScreen from './CodeOfConductScreen'
import { goToNextRoute } from '../navigation/LoginRouter'

interface OwnProps {

}

interface StateProps {
  acceptedCoC: boolean
}

interface DispatchProps {
  acceptCoC: () => void
}

interface State {
}

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>

class AcceptCoCScreen extends PureComponent<Props, State> {

  render() {
    return <CodeOfConductScreen onPress={this.goToNextRoute}/>
  }

  private goToNextRoute = () => {
    this.props.acceptCoC()
    goToNextRoute(this.props.navigation)
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    acceptedCoC: state.auth.codeOfConductAccepted,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    acceptCoC: () => dispatch(acceptCoC()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AcceptCoCScreen)
