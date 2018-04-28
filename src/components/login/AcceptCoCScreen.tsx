import React, { PureComponent } from 'react'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../redux'
import { acceptCoC } from '../../services/coc'
import CodeOfConductScreen from './CodeOfConductScreen'
import { goToNextRoute } from '../navigation/LoginRouter'

interface OwnProps {

}

interface StateProps {
  acceptedCoC: boolean
  seenTutorial: boolean
}

interface DispatchProps {
  acceptCoC: () => void
}

interface State {
}

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>

class AcceptCoCScreen extends PureComponent<Props, State> {

  componentDidMount() {
    if (this.props.acceptedCoC) {
      goToNextRoute(this.props.navigation)
    }
  }

  componentWillReceiveProps(newProps: Props) {
    if (newProps.acceptedCoC) {
      goToNextRoute(this.props.navigation)
    }
  }

  render() {
    return <CodeOfConductScreen onPress={this.props.acceptCoC}/>
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    acceptedCoC: state.coc.codeOfConductAccepted,
    seenTutorial: false, // TODO
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    acceptCoC: () => dispatch(acceptCoC()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AcceptCoCScreen)
