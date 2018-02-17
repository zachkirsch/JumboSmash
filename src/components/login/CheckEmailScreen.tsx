import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Platform } from 'react-native'
import { default as SimpleLineIcons } from 'react-native-vector-icons/SimpleLineIcons'
import { AuthError } from '../../services/api'

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
    clearInterval(this.resendCodeTimer)
  }

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
    const bottomLinkStyle = [styles.bottomLink]
    if (resendEmailButtonDisabled) {
      bottomLinkStyle.push(styles.bottomLinkDisabled)
    }

    return (
      <View>
        <View style={styles.checkEmailContentContainer}>
          <SimpleLineIcons name='envelope' size={75} color='rgb(202, 183, 241)' />
          <View style={styles.contentTitleContainer}>
            <Text style={[styles.text, styles.contentTitle, styles.bold]}>
              CHECK YOUR EMAIL!
            </Text>
          </View>
          <View style={styles.largeMargin}>
            <Text style={styles.text}>
              {instructions}
              <Text style={[styles.text, styles.bold]}>
                {this.props.email}
              </Text>
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={inputStyle}
              placeholder='••••••'
              onChangeText={this.onChangeCode}
              value={this.state.verificationCode}
              keyboardType={'numeric'}
              onSubmitEditing={() => this.submitVerificationCode(this.state.verificationCode)}
              returnKeyType={'go'}
              maxLength={CODE_LENGTH}
              underlineColorAndroid={underlineColorAndroid}
              autoFocus
              enablesReturnKeyAutomatically
            />
          </View>
        </View>
        <View
          style={[styles.bottomLinkContainer, styles.bottomLinkContainerWithRoomForKeyboard]}
        >
          <TouchableOpacity
            onPress={this.requestResendVerificationCode}
            disabled={resendEmailButtonDisabled}
          >
            <Text style={bottomLinkStyle}>
              {resendEmailTitle}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
      if (secondsUntilCanResendEmail === 0) {
        clearInterval(this.resendCodeTimer)
        this.resendCodeTimer = undefined
      } else {
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
    fontSize: 15,
    fontWeight: '300',
    fontFamily: 'Avenir',
  },
  bold: {
    fontFamily: 'Avenir-Heavy',
    fontWeight: '800',
  },
  largeMargin: {
    paddingHorizontal: '15%',
  },
  checkEmailContentContainer: {
    flex: 3,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  contentTitleContainer: {
    marginBottom: 10,
  },
  contentTitle: {
    fontSize: 21,
    color: 'black',
  },
  inputContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  input: {
    shadowColor: 'rgb(238,219,249)',
    shadowOpacity: 1,
    shadowRadius: 50,
    height: 50,
    width: 200,
    marginTop: 10,
    padding: 10,
    fontSize: 30,
    letterSpacing: 100,
    fontWeight: '300',
    fontFamily: 'Avenir',
    textAlign: 'center',
    color: 'black',
  },
  badCode: {
    color: '#A82A2A',
  },
  badCodeIOS: {
    borderWidth: 1,
    borderColor: '#A82A2A',
  },
  bottomLinkContainer: {
    flex: 1.6,
    marginBottom: 30,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bottomLinkContainerWithRoomForKeyboard: {
    flex: 2.5,
    justifyContent: 'flex-start',
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  bottomLink: {
    fontSize: 14,
    fontWeight: '300',
    fontFamily: 'Avenir',
    color: 'black',
  },
  bottomLinkDisabled: {
    color: 'rgba(74,74,74,0.84)',
  },
})
