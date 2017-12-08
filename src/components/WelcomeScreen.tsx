import React, { PureComponent } from 'react'
import { connect, Dispatch } from 'react-redux'
import { requestVerification, verifyEmail, Credentials } from '../services/auth'
import { RootState } from '../redux'
import LoginScreen from './LoginScreen'
import VerificationCodeScreen from './VerificationCodeScreen'

interface StateProps {
  email: string
  authErrorMessage: string
  validEmail: boolean
  validVerificationCode: boolean
}

interface DispatchProps {
  requestVerification: (credentials: Credentials) => void
  verifyEmail: (code: string) => void
}

type Props = StateProps & DispatchProps

class WelcomeScreen extends PureComponent<Props, {}> {

  public render() {
    if (!this.props.validEmail) {
      return (
        <LoginScreen
          onSubmitCredentials={this.props.requestVerification}
          initialCredentials={{email: this.props.email}}
          authErrorMessage={this.props.authErrorMessage}
        />
      )
    } else if (!this.props.validVerificationCode) {
      return (
        <VerificationCodeScreen
          email={this.props.email}
          onSubmitVerificationCode={this.props.verifyEmail}
          requestResendVerificationCode={this.requestResendVerificationCode}
          authErrorMessage={this.props.authErrorMessage}
        />
      )
    } else {
      return undefined
    }
  }

  private requestResendVerificationCode = () => {
    const credentials: Credentials = {
      email: this.props.email,
    }
    this.props.requestVerification(credentials)
  }

}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    email: state.auth.email,
    authErrorMessage: state.auth.errorMessage,
    validEmail: state.auth.validEmail,
    validVerificationCode: state.auth.validVerificationCode,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState> ): DispatchProps => {
  return {
    requestVerification: (credentials: Credentials) => dispatch(requestVerification(credentials)),
    verifyEmail: (code: string) => dispatch(verifyEmail(code)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen)
