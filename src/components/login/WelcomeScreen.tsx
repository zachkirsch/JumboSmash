import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect, Dispatch } from 'react-redux'
import { requestVerification, verifyEmail, Credentials } from '../../services/auth'
import { RootState } from '../../redux'
import LoginScreen from './LoginScreen'
import VerifyEmailScreen from './VerifyEmailScreen'
import EmailUsFooter from './EmailUsFooter'

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
      return this.renderLoginScreen(
        <LoginScreen
          onSubmitCredentials={this.props.requestVerification}
          initialCredentials={{email: this.props.email}}
          authErrorMessage={this.props.authErrorMessage}
        />
      )
    } else if (!this.props.validVerificationCode) {
      return this.renderLoginScreen(
        <VerifyEmailScreen
          email={this.props.email}
          submitVerificationCode={this.props.verifyEmail}
          requestResendVerificationCode={this.requestResendVerificationCode}
          authErrorMessage={this.props.authErrorMessage}
        />
      )
    } else {
      return undefined
    }
  }

  private renderLoginScreen = (screen: JSX.Element) => {
    return (
      <View style={styles.container}>
        {screen}
        <EmailUsFooter/>
      </View>
    )
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
