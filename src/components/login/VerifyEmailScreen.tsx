import React, { PureComponent } from 'react'
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
  Keyboard,
} from 'react-native'
import { connect, Dispatch } from 'react-redux'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { RootState } from '../../redux'
import { verifyEmail, requestVerification, clearAuthErrorMessage, Credentials } from '../../services/auth'
import { AuthError, getAuthErrorFromMessage } from '../../services/api'
import CheckEmailScreen from './CheckEmailScreen'
import EmailUsFooter from './EmailUsFooter'
import { JSText, scale } from '../common'

interface OwnProps {
  focusKeyboardOnLoginScreen?: () => void
}

interface StateProps {
  email: string
  authError: AuthError
  waitingForRequestVerificationResponse: boolean
  waitingForVerificationResponse: boolean
  isLoggedIn: boolean
  acceptedCoC: boolean
}

interface DispatchProps {
  submitVerificationCode: (code: string) => void
  requestVerification: (credentials: Credentials) => void
  clearAuthErrorMessage: () => void
}

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>

interface State {
  requestedResend: boolean
}

const CODE_LENGTH = 6
const VERIFY_EMAIL_INCOMING_URL_REGEX = new RegExp(`jumbosmash2018:\/\/verify\/([A-Z0-9]{${CODE_LENGTH}})`)

class VerifyEmailScreen extends PureComponent<Props, State> {

  private checkEmailScreen: CheckEmailScreen

  constructor(props: Props) {
    super(props)
    this.state = {
      requestedResend: false,
    }
  }

  public componentDidMount() {
    this.props.navigation.addListener(
      'willFocus',
      () => {
        this.props.clearAuthErrorMessage()
      }
    )

    this.props.navigation.addListener(
      'didBlur',
      () => {
        this.setState({
          requestedResend: false,
        })
        if (this.checkEmailScreen) {
          this.checkEmailScreen.resetState()
        }
      }
    )

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
  }

  public componentWillReceiveProps(newProps: Props) {
    if (newProps.isLoggedIn && !newProps.acceptedCoC) {
      Keyboard.dismiss()
      this.props.navigation.navigate('CodeOfConductScreen')
    }
  }

  public render() {

    let renderScreen: () => JSX.Element
    if (this.props.waitingForRequestVerificationResponse && !this.state.requestedResend) {
      renderScreen = this.renderLoadingScreen
    } else if (this.props.authError !== AuthError.NO_ERROR && this.props.authError !== AuthError.BAD_CODE) {
      renderScreen = this.renderErrorScreen
    } else {
      renderScreen = this.renderCheckEmailScreen
    }

    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          {renderScreen()}
        </View>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={this.goBack}
          >
            <Ionicons name='ios-arrow-back' size={scale(30)} color='black' />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  private renderLoadingScreen = () => (
    <View style={styles.loadingScreen}>
      <ActivityIndicator size='large' color='rgba(172,203,238,0.6)' />
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

    let bottomSection: JSX.Element = undefined
    if (this.props.authError === AuthError.NOT_SENIOR) {
      bottomSection = (
        <EmailUsFooter
          emailSubject="I'm a senior... let me into JumboSmash"
          label='Think you qualify to use JumboSmash?'
        />
      )
    }

    return (
      <View>
        <View style={styles.errorContentContainer}>
          <View style={styles.errorIconContainer}>
            <MaterialIcons name='error-outline' size={75} color='rgba(172,203,238,0.6)' />
          </View>
          <JSText style={[styles.text, styles.largeMargin]}>
            {messageToUser}
          </JSText>
        </View>
        {bottomSection}
      </View>
    )
  }

  private renderCheckEmailScreen = () => (
    <CheckEmailScreen
      email={this.props.email}
      requestResend={this.requestResend}
      submitVerificationCode={this.props.submitVerificationCode}
      authError={this.props.authError}
      clearAuthErrorMessage={this.props.clearAuthErrorMessage}
      ref={(ref) => this.checkEmailScreen = ref}
      waitingForVerificationResponse={this.props.waitingForVerificationResponse}
    />
  )

  private handleOpenURLiOS = (event: {url: string}) => {
    this.handleOpenURL(event.url)
  }

  private handleOpenURL = (url: string) => {
    const match = VERIFY_EMAIL_INCOMING_URL_REGEX.exec(url)
    if (match) {
      const code = match[1]
      this.props.submitVerificationCode(code)
    }
  }

  private requestResend = () => {
    const credentials: Credentials = {
      email: this.props.email,
    }
    this.props.requestVerification(credentials)
    this.setState({
      requestedResend: true,
    })
  }

  private goBack = () => {
    if (this.checkEmailScreen && this.checkEmailScreen.textInputIsFocused()) {
      this.getOwnProps().focusKeyboardOnLoginScreen()
    }
    this.props.navigation.goBack()
  }

  private getOwnProps = (): OwnProps => {
    return this.props.navigation.state.params || {}
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    authError: getAuthErrorFromMessage(state.auth.errorMessage),
    waitingForRequestVerificationResponse: state.auth.waitingForRequestVerificationResponse,
    waitingForVerificationResponse: state.auth.waitingForVerificationResponse,
    email: state.auth.email,
    acceptedCoC: state.coc.codeOfConductAccepted,
    isLoggedIn: state.auth.isLoggedIn,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    requestVerification: (credentials: Credentials) => dispatch(requestVerification(credentials)),
    submitVerificationCode: (code: string) => dispatch(verifyEmail(code)),
    clearAuthErrorMessage: () => dispatch(clearAuthErrorMessage()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmailScreen)

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
  largeMargin: {
    paddingHorizontal: '15%',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  headerContainer: {
   position: 'absolute',
   top: Platform.OS === 'ios' ? 40 : 20, // space for iOS status bar
   left: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: '20%',
  },
  errorContentContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIconContainer: {
    marginBottom: 20,
  },
  bottomSection: {
    flex: 1.6,
    marginBottom: 30,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
})
