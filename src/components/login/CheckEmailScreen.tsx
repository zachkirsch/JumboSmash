import React, { PureComponent } from 'react'
import { View, KeyboardAvoidingView, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import { default as SimpleLineIcons } from 'react-native-vector-icons/SimpleLineIcons'
import { AuthError } from '../../services/api'
import { JSText, JSTextInput, TextInputRef, scale } from '../generic'
import EmailUsFooter from './EmailUsFooter'

interface Props {
  email: string
  requestResend: () => void
  submitVerificationCode: (code: string) => void
  authError: AuthError
  clearAuthErrorMessage: () => void
}

interface State {
  verificationCode: string
  secondsUntilCanResendEmail: number
}

const INITIAL_SECONDS_UNTIL_CAN_RESEND_EMAIL = 9
const CODE_LENGTH = 6
const INITIAL_STATE: State = {
  verificationCode: '',
  secondsUntilCanResendEmail: INITIAL_SECONDS_UNTIL_CAN_RESEND_EMAIL,
}

class CheckEmailScreen extends PureComponent<Props, State> {

  private resendCodeTimer: number
  private textInputRef: TextInputRef

  constructor (props: Props) {
    super(props)
    this.state = INITIAL_STATE
  }

  public componentDidMount() {
    this.startResendTimer()
  }

  public componentWillUnmount() {
    clearInterval(this.resendCodeTimer)
  }

  public resetState = () => {
    this.setState(INITIAL_STATE)
  }

  public focusTextInput = () => {
    if (this.textInputRef) {
      this.textInputRef.focus()
    }
  }

  public textInputIsFocused = () => this.textInputRef && this.textInputRef.isFocused()

  public render() {
    let instructions = ''
    instructions += 'To start using JumboSmash, type in the '
    instructions += 'six digit code we just emailed to '

    let inputStyle = [styles.input]
    let underlineColorAndroid
    if (this.props.authError === AuthError.BAD_CODE) {
      inputStyle.push(styles.badCode)
      if (Platform.OS === 'ios') {
        inputStyle.push(styles.badCodeIOS)
      } else if (Platform.OS === 'android') {
        underlineColorAndroid = '#A82A2A'
      }
    }

    let resendEmailTitle = 'Resend Email'
    if (this.state.secondsUntilCanResendEmail) {
      resendEmailTitle += ' in ' + this.state.secondsUntilCanResendEmail
    }

    const resendEmailButtonDisabled = this.state.secondsUntilCanResendEmail > 0
    const resendLinkStyle = []
    if (resendEmailButtonDisabled) {
      resendLinkStyle.push(styles.resendLinkDisabled)
    }

    return (
      <ScrollView
        keyboardShouldPersistTaps='handled'
        scrollEnabled={false}
        contentContainerStyle={styles.wrapper}
      >
        <View style={styles.header} />
        <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
          <View style={styles.messageContainer}>
            <SimpleLineIcons name='envelope' size={scale(50)} color='rgba(172,203,238,0.6)' />
            <View style={styles.contentTitleContainer}>
              <JSText bold fontSize={18} style={[styles.text, styles.contentTitle]}>
                CHECK YOUR EMAIL!
              </JSText>
            </View>
          </View>
          <View style={styles.instructionsContainer}>
            <JSText style={styles.text}>
              {instructions}
              <JSText bold style={[styles.text]}>
                {this.props.email}
              </JSText>
            </JSText>
          </View>
          <View style={styles.codeContainer}>
            <View style={styles.inputContainer}>
              <JSTextInput
                style={inputStyle}
                onChangeText={this.onChangeCode}
                value={this.state.verificationCode}
                placeholder='••••••'
                keyboardType={'numeric'}
                onSubmitEditing={() => this.submitVerificationCode(this.state.verificationCode)}
                returnKeyType={'go'}
                maxLength={CODE_LENGTH}
                underlineColorAndroid={underlineColorAndroid}
                enablesReturnKeyAutomatically
                textInputRef={(ref: TextInputRef) => this.textInputRef = ref}
                fontSize={30}
              />
            </View>
            <View style={styles.resendLinkContainer} >
              <TouchableOpacity
                onPress={this.requestResendVerificationCode}
                disabled={resendEmailButtonDisabled}
              >
                <JSText fontSize={14} style={resendLinkStyle}>
                  {resendEmailTitle}
                </JSText>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
        <View style={styles.footer} />
        <EmailUsFooter />
      </ScrollView>
    )
  }

  private onChangeCode = (code: string) => {
    this.setState({
      verificationCode: code,
    })
    if (code.length === CODE_LENGTH) {
      this.submitVerificationCode(code)
    } else if (this.props.authError === AuthError.BAD_CODE) {
      this.props.clearAuthErrorMessage()
    }
  }

  private submitVerificationCode = (code: string) => this.props.submitVerificationCode(code)

  private requestResendVerificationCode = () => {
    this.props.requestResend()
    this.setState({
      secondsUntilCanResendEmail: INITIAL_SECONDS_UNTIL_CAN_RESEND_EMAIL,
    }, this.startResendTimer)
  }

  private startResendTimer = () => {
    if (this.resendCodeTimer !== undefined) {
      return
    }
    this.resendCodeTimer = setInterval(() => {
      const secondsUntilCanResendEmail = this.state.secondsUntilCanResendEmail
      if (secondsUntilCanResendEmail > 0) {
        this.setState({
          secondsUntilCanResendEmail: secondsUntilCanResendEmail - 1,
        })
      }
    }, 1000)
  }
}

export default CheckEmailScreen

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-around',
  },
  header: {
    height: 75,
  },
  footer: {
    height: 100,
  },
  messageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionsContainer: {
    paddingHorizontal: '15%',
  },
  codeContainer: {
    justifyContent: 'flex-start',
  },
  contentTitleContainer: {
    marginBottom: 10,
  },
  contentTitle: {
    color: 'black',
  },
  inputContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  input: {
    width: 200,
    marginTop: 10,
    marginBottom: 0,
    paddingVertical: 5,
    letterSpacing: 100,
    color: 'black',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  badCode: {
    color: '#A82A2A',
  },
  badCodeIOS: {
    borderColor: '#A82A2A',
  },
  resendLinkContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    backgroundColor: 'transparent',
  },
  resendLinkDisabled: {
    color: 'rgba(74,74,74,0.84)',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
})
