import React, { PureComponent } from 'react'
import { View, Text, Button, StyleSheet, Linking, Platform } from 'react-native'
import { connect, Dispatch } from 'react-redux'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { RootState } from '../../redux'
import { verifyEmail, requestVerification, Credentials } from '../../services/auth'

interface OwnProps {
  credentials: Credentials
}

interface StateProps {
  authErrorMessage?: string
}

interface DispatchProps {
  submitVerificationCode: (code: string) => void
  requestVerification: (credentials: Credentials) => void
}

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>

interface State {
  verificationCode: string
  secondsUntilCanResendEmail: number
  errorMessage: string
}

const CODE_LENGTH = 6
const VERIFY_EMAIL_INCOMING_URL_REGEX = new RegExp(`jumbosmash2018:\/\/verify\/([A-Z0-9]{${CODE_LENGTH}})`)
const INITIAL_RESEND_EMAIL_WAIT_TIME = 10 // seconds

class VerifyEmailScreen extends PureComponent<Props, State> {

  private resendCodeTimer: number

  constructor (props: Props) {
    super(props)
    this.state = {
      verificationCode: '',
      secondsUntilCanResendEmail: INITIAL_RESEND_EMAIL_WAIT_TIME,
      errorMessage: '',
    }
  }

  public componentDidMount() {

    // listen for verification link
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        if (url !== null) {
          this.handleOpenURL(url)
        }
      })
    } else {
      Linking.addEventListener('url', this.handleOpenURLiOS)
    }

    // countdown for resend button
    if (INITIAL_RESEND_EMAIL_WAIT_TIME > 0) {
      this.resendCodeTimer = setInterval(() => {
        this.setState({
          secondsUntilCanResendEmail: this.state.secondsUntilCanResendEmail - 1,
        })
      }, 1000)
    }
  }

  public componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURLiOS)
    clearInterval(this.resendCodeTimer)
  }

  public render() {

    let resendCodeButtonTitle = 'Resend Code'
    if (this.state.secondsUntilCanResendEmail > 0) {
      resendCodeButtonTitle = 'Resend in ' + this.state.secondsUntilCanResendEmail
    }

    let instructions = ''
    instructions += 'We just emailed ' + this.getEmail() + ' with instructions to get onto JumboSmash.'

    return (
      <View style={[styles.container, styles.center]}>
        <View>
          <Text style={styles.centerText}>{instructions}</Text>
          <Text style={[styles.centerText, styles.errorMessage]}>
            {this.props.authErrorMessage || this.state.errorMessage}
          </Text>
        </View>
        <Button
          onPress={this.requestResendVerificationCode}
          title={resendCodeButtonTitle}
          disabled={this.state.secondsUntilCanResendEmail > 0}
        />
        <Button
          onPress={() => this.props.navigation.goBack()}
          title={'Go Back'}
        />
      </View>
    )
  }

  private handleOpenURLiOS = (event: {url: string}) => {
    this.handleOpenURL(event.url)
  }

  private handleOpenURL = (url: string) => {
    const match = VERIFY_EMAIL_INCOMING_URL_REGEX.exec(url)
    if (!match) {
      this.setState({
        errorMessage: 'That is not a valid URL.\nYou can resend the email if you want.',
        secondsUntilCanResendEmail: 0,
      })
    } else {
      const code = match[1]
      this.props.submitVerificationCode(code)
    }
  }

  private requestResendVerificationCode = () => {
    const credentials: Credentials = {
      email: this.getEmail(),
    }
    this.props.requestVerification(credentials)
    this.setState({
      secondsUntilCanResendEmail: INITIAL_RESEND_EMAIL_WAIT_TIME,
    })
  }

  private getEmail = () => this.props.navigation.state.params.credentials.email

}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    authErrorMessage: state.auth.errorMessage,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState> ): DispatchProps => {
  return {
    requestVerification: (credentials: Credentials) => dispatch(requestVerification(credentials)),
    submitVerificationCode: (code: string) => dispatch(verifyEmail(code)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmailScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 3,
  },
  center: {
    justifyContent: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  errorMessage: {
    color: 'red',
    fontWeight: 'bold',
  },
})
