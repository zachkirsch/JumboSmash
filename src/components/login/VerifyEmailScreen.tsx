import React, { PureComponent } from 'react'
import {
  ActivityIndicator,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../redux'
import { AuthError, getAuthErrorFromMessage } from '../../services/api'
import { clearAuthErrorMessage, Credentials, requestVerification, verifyEmail } from '../../services/auth'
import { JSText } from '../common'
import CheckEmailScreen from './CheckEmailScreen'
import EmailUsFooter from './EmailUsFooter'

interface OwnProps {
}

interface StateProps {
  email: string
  authError: AuthError
  waitingForRequestVerificationResponse: boolean
  waitingForVerificationResponse: boolean
}

interface DispatchProps {
  submitVerificationCode: (code: string) => void
  requestVerification: (credentials: Credentials) => void
  clearAuthErrorMessage: () => void
}

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>

interface State {
  shouldForceShowVerifyingOverlay: boolean
}

const CODE_LENGTH = {
  number: 6,
  string: 'six',
}
const MAGIC_LINK_REGEX = new RegExp(`jumbosmash2018:\/\/verify\/([0-9]{${CODE_LENGTH.number}})`)

class VerifyEmailScreen extends PureComponent<Props, State> {

  private checkEmailScreen: CheckEmailScreen | null
  private componentIsMounted = false

  constructor(props: Props) {
    super(props)
    this.state = {
      shouldForceShowVerifyingOverlay: false,
    }
  }

  public componentDidMount() {
    this.componentIsMounted = true
    this.props.navigation.addListener(
      'willFocus',
      () => {
        this.props.clearAuthErrorMessage()
      }
    )

    // listen for verification link
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then((url) => {
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
    this.componentIsMounted = false
  }

  public render() {

    let renderScreen: () => JSX.Element
    if (this.props.waitingForRequestVerificationResponse) {
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
            style={styles.goBack}
          >
            <Ionicons name='ios-arrow-back' size={30} color='black' />
          </TouchableOpacity>
        </View>
        {this.renderVerifyingOverlay()}
      </View>
    )
  }

  private renderVerifyingOverlay = () => {
    if (!this.props.waitingForVerificationResponse && !this.state.shouldForceShowVerifyingOverlay) {
      return null
    }
    return (
      <View style={[StyleSheet.absoluteFill, {backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center'}]}>
        <ActivityIndicator
          size='large'
          animating
          color='white'
        />
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

    let bottomSection = null
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
      submitVerificationCode={this.submitVerificationCode}
      authError={this.state.shouldForceShowVerifyingOverlay ? undefined : this.props.authError}
      clearAuthErrorMessage={this.props.clearAuthErrorMessage}
      ref={ref => this.checkEmailScreen = ref}
      waitingForVerificationResponse={this.props.waitingForVerificationResponse}
      codeLength={CODE_LENGTH}
    />
  )

  private submitVerificationCode = (code: string) => {
    this.setState({
      shouldForceShowVerifyingOverlay: true,
    }, () => setTimeout(() => {
      if (this.componentIsMounted) {
        this.setState({
          shouldForceShowVerifyingOverlay: false,
        })
      }
    }, 1000))
    this.props.submitVerificationCode(code)
  }

  private handleOpenURLiOS = (event: {url: string}) => {
    this.handleOpenURL(event.url)
  }

  private handleOpenURL = (url: string) => {
    const match = MAGIC_LINK_REGEX.exec(url)
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
  }

  private goBack = () => {
    this.props.navigation.goBack()
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    authError: getAuthErrorFromMessage(state.auth.errorMessage),
    waitingForRequestVerificationResponse: state.auth.waitingForRequestVerificationResponse,
    waitingForVerificationResponse: state.auth.waitingForVerificationResponse,
    email: state.auth.email,
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
   top: Platform.OS === 'ios' ? 20 : 0, // space for iOS status bar
  },
  goBack: {
    padding: 20,
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
