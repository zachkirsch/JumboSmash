import React, { PureComponent } from 'react'
import { View, Text, TextInput, Button, StyleSheet, Linking, Platform } from 'react-native'

interface OwnProps {
  email: string
  submitVerificationCode: (code: string) => void
  requestResendVerificationCode: () => void
  authErrorMessage?: string
}

type Props = OwnProps

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
    instructions += 'We just "emailed" ' + this.props.email + ' with a link and a code.'
    instructions += ' Click the link on your phone or put the code in this text box.'
    instructions += ' Check your email! (i.e. the server logs)'

    return (
      <View style={[styles.container, styles.center]}>
        <View>
          <Text style={styles.centerText}>{instructions}</Text>
          <Text style={[styles.centerText, styles.errorMessage]}>
            {this.props.authErrorMessage || this.state.errorMessage}
          </Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder='Code'
          onChangeText={this.onChangeVerificationCode}
          value={this.state.verificationCode}
          keyboardType={'numeric'}
          maxLength={6}
          enablesReturnKeyAutomatically={true}
          onSubmitEditing={this.onSubmitVerificationCode}
          returnKeyType={'go'}
          autoFocus={true}
        />
        <Button
          onPress={this.onSubmitVerificationCode}
          title='Login'
          disabled={this.state.verificationCode.length !== CODE_LENGTH}
        />
        <Button
          onPress={this.onRequestResendCode}
          title={resendCodeButtonTitle}
          disabled={this.state.secondsUntilCanResendEmail > 0}
        />
      </View>
    )
  }

  private onChangeVerificationCode = (verificationCode: string) => {
    this.setState({
      verificationCode,
    })
  }

  private onSubmitVerificationCode = () => {
    this.props.submitVerificationCode(this.state.verificationCode)
  }

  private onRequestResendCode = () => {
    this.props.requestResendVerificationCode()
    this.setState({
      secondsUntilCanResendEmail: INITIAL_RESEND_EMAIL_WAIT_TIME,
    })
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

}

export default VerifyEmailScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 3,
  },
  center: {
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 5,
    padding: 5,
  },
  centerText: {
    textAlign: 'center',
  },
  errorMessage: {
    color: 'red',
    fontWeight: 'bold',
  },
})
