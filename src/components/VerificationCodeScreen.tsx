import React, { PureComponent } from 'react'
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'

interface OwnProps {
  email: string
  onSubmitVerificationCode: (code: string) => void
  requestResendVerificationCode: () => void
  authErrorMessage?: string
}

type Props = OwnProps

interface State {
  verificationCode: string
  secondsUntilCanResendCode: number
}

const CODE_LENGTH = 6
const INITIAL_RESEND_CODE_WAIT_TIME = 0 // seconds

class VerificationCodeScreen extends PureComponent<Props, State> {

  private resendCodeTimer: number

  constructor (props: Props) {
    super(props)
    this.state = {
      verificationCode: '',
      secondsUntilCanResendCode: INITIAL_RESEND_CODE_WAIT_TIME,
    }
  }

  public componentDidMount() {
    if (INITIAL_RESEND_CODE_WAIT_TIME > 0) {
      this.resendCodeTimer = setInterval(() => {
        this.setState({
          secondsUntilCanResendCode: this.state.secondsUntilCanResendCode - 1,
        })
      }, 1000)
    }
  }

  public componentWillUnmount() {
    clearInterval(this.resendCodeTimer)
  }

  public render() {

    let resendCodeButtonTitle = 'Resend Code'
    if (this.state.secondsUntilCanResendCode > 0) {
      resendCodeButtonTitle = 'Resend Code in ' + this.state.secondsUntilCanResendCode
    }

    return (
      <View style={[styles.container, styles.center]}>
      <View style={styles.centerText}>
          <Text>We just "emailed" {this.props.email} with the code</Text>
          <Text style={styles.errorMessage}>
            {this.props.authErrorMessage}
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
          disabled={this.state.secondsUntilCanResendCode > 0}
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
    this.props.onSubmitVerificationCode(this.state.verificationCode)
  }

  private onRequestResendCode = () => {
    this.props.requestResendVerificationCode()
    this.setState({
      secondsUntilCanResendCode: INITIAL_RESEND_CODE_WAIT_TIME,
    })
  }

}

export default VerificationCodeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
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
    alignItems: 'center',
  },
  errorMessage: {
    color: 'red',
    fontWeight: 'bold',
  },
})
