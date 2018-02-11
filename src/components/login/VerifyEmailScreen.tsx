import React, { PureComponent } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Linking,
  Platform,
  Keyboard,
} from 'react-native'
import { connect, Dispatch } from 'react-redux'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { default as Ionicons } from 'react-native-vector-icons/Ionicons'
import { default as SimpleLineIcons } from 'react-native-vector-icons/SimpleLineIcons'
import { default as MaterialIcons } from 'react-native-vector-icons/MaterialIcons'
import { emailSupport } from './utils'
import { RootState } from '../../redux'
import { verifyEmail, requestVerification, clearAuthErrorMessage, Credentials } from '../../services/auth'
import { AuthError, getAuthErrorFromMessage } from '../../services/api'

interface OwnProps {
  timeOfNavigation?: number
}

interface StateProps {
  email: string
  authError: AuthError
  loading: boolean
}

interface DispatchProps {
  submitVerificationCode: (code: string) => void
  requestVerification: (credentials: Credentials) => void
  clearAuthErrorMessage: () => void
}

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>

interface State {
  verificationCode: string
  canRequestResend: boolean
  requestedResend: boolean
}

const INITIAL_STATE: State = {
  verificationCode: '',
  requestedResend: false,
  canRequestResend: true,
}

const CODE_LENGTH = 6
const VERIFY_EMAIL_INCOMING_URL_REGEX = new RegExp(`jumbosmash2018:\/\/verify\/([A-Z0-9]{${CODE_LENGTH}})`)

class VerifyEmailScreen extends PureComponent<Props, State> {

  private resendCodeTimer: number

  constructor (props: Props) {
    super(props)
    this.state = INITIAL_STATE
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
  }

  public componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURLiOS)
    clearTimeout(this.resendCodeTimer)
  }

  public componentWillReceiveProps(newProps: Props) {
    const getTimeOfNavigation = (props: Props) => props.navigation.state.params.timeOfNavigation

    if (getTimeOfNavigation(this.props) !== getTimeOfNavigation(newProps)) {
      this.setState(INITIAL_STATE)
    } else if (this.props.email !== newProps.email) {
      this.setState({
        requestedResend: false,
        canRequestResend: true,
      })
    }
  }

  public render() {

    let renderScreen: () => JSX.Element
    if (this.props.loading && !this.state.requestedResend) {
      renderScreen = this.renderLoadingScreen
    } else if (this.props.authError === AuthError.NO_ERROR || this.props.authError === AuthError.BAD_CODE) {
      renderScreen = this.renderCheckEmailScreen
    } else {
      renderScreen = this.renderErrorScreen
    }

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={this.goBack}
          >
            <Ionicons name='ios-arrow-back' size={30} color='black' />
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          {renderScreen()}
        </View>
      </View>
    )
  }

  private renderLoadingScreen = () => (
    <View style={styles.loadingScreen}>
      <ActivityIndicator size='large' color='rgb(202, 183, 241)' />
    </View>
  )

  private renderErrorScreen = () => {

    let messageToUser: string
    switch (this.props.authError) {
      case AuthError.NOT_SENIOR:
        messageToUser = 'JumboSmash is only open to Tufts seniors. According to our records, '
        messageToUser += "you don't have senior status."
        break
      case AuthError.SERVER_ERROR:
      default:
        messageToUser = "There's been a server error. Please go back and try again."
        break
    }

    return (
      <View>
        <View style={styles.errorContentContainer}>
          <View style={styles.errorIconContainer}>
            <MaterialIcons name='error-outline' size={75} color='rgb(202, 183, 241)' />
          </View>
          <Text style={[styles.text, styles.largeMargin]}>
            {messageToUser}
          </Text>
        </View>
          <View style={styles.bottomLinkContainer} >
          {this.props.authError !== AuthError.NOT_SENIOR ? undefined : (
            <TouchableOpacity
              onPress={() => emailSupport("I'm a senior... let me into JumboSmash")}
            >
              <Text style={styles.bottomLink}>
                Think you qualify to use JumboSmash?
              </Text>
            </TouchableOpacity>
          )}
          </View>
      </View>
    )
  }

  private renderCheckEmailScreen = () => {
    let instructions = ''
    instructions += 'To start using JumboSmash, type in the '
    instructions += 'six digit code we just emailed to '

    let inputStyle = [styles.input]
    let underlineColorAndroid
    if (this.props.authError === AuthError.BAD_CODE) {
      if (Platform.OS === 'ios') {
        inputStyle.push(styles.badCode)
      } else if (Platform.OS === 'android') {
        underlineColorAndroid = '#A82A2A'
      }
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
              enablesReturnKeyAutomatically
              autoFocus
            />
          </View>
        </View>
        <View style={styles.bottomLinkContainer} >
          <TouchableOpacity
            onPress={this.requestResendVerificationCode}
            disabled={!this.state.canRequestResend}
          >
            <Text style={styles.bottomLink}>
              Resend Email
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  private handleOpenURLiOS = (event: {url: string}) => {
    this.handleOpenURL(event.url)
  }

  private handleOpenURL = (url: string) => {
    const match = VERIFY_EMAIL_INCOMING_URL_REGEX.exec(url)
    if (!match) {
      // TODO: alert user
    } else {
      const code = match[1]
      this.submitVerificationCode(code)
    }
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
    this.setState({
      requestedResend: true,
      canRequestResend: false,
    }, () => {
      const credentials: Credentials = {
        email: this.props.email,
      }
      this.props.requestVerification(credentials)
      this.resendCodeTimer = setTimeout(() => {
        this.setState({
          canRequestResend: true,
        })
      }, 1000)
    })
  }

  private goBack = () => {
    Keyboard.dismiss()
    this.props.navigation.goBack()
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    authError: getAuthErrorFromMessage(state.auth.errorMessage),
    loading: state.auth.waitingForVerificationResponse,
    email: state.auth.email,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState> ): DispatchProps => {
  return {
    requestVerification: (credentials: Credentials) => dispatch(requestVerification(credentials)),
    submitVerificationCode: (code: string) => dispatch(verifyEmail(code)),
    clearAuthErrorMessage: () => dispatch(clearAuthErrorMessage()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmailScreen)

const styles = StyleSheet.create({

  /* generic styles */

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

  /* main containers */

  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  headerContainer: {
    justifyContent: 'flex-end',
    height: Platform.OS === 'ios' ? 75 : 50, // space for iOS status bar
    paddingHorizontal: '8%',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* loading screen */

  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: '20%',
  },

  /* other screens */

  checkEmailContentContainer: {
    flex: 3,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  errorContentContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  errorIconContainer: {
    marginBottom: 20,
  },
  contentTitleContainer: {
    marginBottom: 10,
  },
  contentTitle: {
    fontSize: 21,
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
    marginTop: 50,
    width: 200,
    padding: 10,
    fontSize: 30,
    letterSpacing: 100,
    fontWeight: '300',
    fontFamily: 'Avenir',
    textAlign: 'center',
  },
  badCode: {
    borderWidth: 1,
    borderColor: '#A82A2A',
  },
  bottomLinkContainer: {
    flex: 1.6,
    marginBottom: 30,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bottomLink: {
    fontSize: 14,
    fontWeight: '300',
    fontFamily: 'Avenir',
    color: 'rgba(74,74,74,0.84)',
  },
})
