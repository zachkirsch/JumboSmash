import React, { PureComponent } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
  Keyboard,
} from 'react-native'
import { connect, Dispatch } from 'react-redux'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { default as Ionicons } from 'react-native-vector-icons/Ionicons'
import { default as MaterialIcons } from 'react-native-vector-icons/MaterialIcons'
import { emailSupport } from './utils'
import { RootState } from '../../redux'
import { verifyEmail, requestVerification, clearAuthErrorMessage, Credentials } from '../../services/auth'
import { AuthError, getAuthErrorFromMessage } from '../../services/api'
import CheckEmailScreen from './CheckEmailScreen'

interface OwnProps {
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

  public render() {

    let renderScreen: () => JSX.Element
    if (this.props.loading && !this.state.requestedResend) {
      renderScreen = this.renderLoadingScreen
    } else if (this.props.authError !== AuthError.NO_ERROR && this.props.authError !== AuthError.BAD_CODE) {
      renderScreen = this.renderErrorScreen
    } else {
      renderScreen = this.renderCheckEmailScreen
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

  private renderCheckEmailScreen = () => (
    <CheckEmailScreen
      email={this.props.email}
      requestResend={this.requestResend}
      submitVerificationCode={this.props.submitVerificationCode}
      authError={this.props.authError}
      clearAuthErrorMessage={this.props.clearAuthErrorMessage}
      ref={(ref) => this.checkEmailScreen = ref}
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
    Keyboard.dismiss()
    this.props.navigation.goBack()
    setTimeout(() => {
      this.setState({
        requestedResend: false,
      })
      if (this.checkEmailScreen) {
        this.checkEmailScreen.resetState()
      }
    }, 500)
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
  text: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '300',
    fontFamily: 'Avenir',
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
    justifyContent: 'flex-end',
    height: Platform.OS === 'ios' ? 75 : 50, // space for iOS status bar
    paddingHorizontal: '8%',
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
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  errorIconContainer: {
    marginBottom: 20,
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
