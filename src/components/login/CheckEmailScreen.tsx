import React, { PureComponent } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { AuthError } from '../../services/api'
import { JSText, JSTextInput, scale, TextInputRef } from '../common'
import EmailUsFooter from './EmailUsFooter'

interface Props {
  email: string
  requestResend: () => void
  submitVerificationCode: (code: string) => void
  waitingForVerificationResponse: boolean
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
  private textInputRef: TextInputRef | null

  constructor(props: Props) {
    super(props)
    this.state = INITIAL_STATE
  }

  componentDidMount() {
    this.startResendTimer()
  }

  componentWillUnmount() {
    clearInterval(this.resendCodeTimer)
  }

  public resetState = () => {
    this.setState(INITIAL_STATE)
  }

  public focusTextInput = () => {
    this.textInputRef && this.textInputRef.focus()
  }

  public textInputIsFocused = () => this.textInputRef && this.textInputRef.isFocused()

  public render() {
    const instructions = 'Please type in the six digit code we just emailed to '

    const inputStyle = [styles.input]
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
          <ActivityIndicator
            size='large'
            animating={this.props.waitingForVerificationResponse}
            color='rgba(172,203,238,0.6)'
          />
          <View style={styles.codeContainer}>
            <View style={styles.inputContainer}>
              <JSTextInput
                style={inputStyle}
                onChangeText={this.onChangeCode}
                value={this.state.verificationCode}
                placeholder='••••••'
                keyboardType={'numeric'}
                maxLength={CODE_LENGTH}
                underlineColorAndroid={underlineColorAndroid}
                fontSize={30}
                enablesReturnKeyAutomatically
                fancy
                textInputRef={this.setTextInputRef}
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

  private setTextInputRef = (ref: TextInputRef) => this.textInputRef = ref

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  input: {
    width: 200,
    marginTop: 0,
    marginBottom: 0,
    paddingVertical: 5,
    letterSpacing: 100,
    color: 'black',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activityIndicatorContainer: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
