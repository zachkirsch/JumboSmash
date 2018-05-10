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
import { AuthState, clearAuthErrorMessages, Credentials, requestVerification, verifyEmail } from '../../services/auth'
import { JSText } from '../common'
import { getMainColor, getLightColor } from '../../utils'
import CheckEmailScreen from './CheckEmailScreen'
import EmailUsFooter from './EmailUsFooter'

interface OwnProps {
}

interface StateProps {
  authState: AuthState
  classYear: number
}

interface DispatchProps {
  submitVerificationCode: (code: string) => void
  requestVerification: (credentials: Credentials) => void
  clearAuthErrorMessages: () => void
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
        this.props.clearAuthErrorMessages()
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

  public componentWillReceiveProps(nextProps: Props) {
    if (nextProps.classYear !== 18 && !nextProps.authState.nearTufts && nextProps.authState.verified.value) {
      this.props.navigation.navigate('ConfirmLocationScreen')
    }
  }

  public render() {

    let renderScreen: () => JSX.Element
    if (this.props.authState.waitingForRequestVerificationResponse) {
      renderScreen = this.renderLoadingScreen
    } else if (this.getVerificationError() !== AuthError.NO_ERROR && this.getVerificationError() !== AuthError.BAD_CODE) {
      renderScreen = this.renderErrorScreen
    } else if (this.props.authState.loggedIn.errorMessage) {
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
            <Ionicons name='ios-arrow-back' size={30} color={getMainColor()} />
          </TouchableOpacity>
        </View>
        {this.renderVerifyingOverlay()}
      </View>
    )
  }

  private renderVerifyingOverlay = () => {
    if (!this.props.authState.verified.loading
        && !this.props.authState.loggedIn.loading
        && !this.state.shouldForceShowVerifyingOverlay) {
      return null
    }
    return (
      <View style={styles.overlay}>
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
      <ActivityIndicator size='large' color={getLightColor()} />
    </View>
  )

  private renderErrorScreen = () => {

    let messageToUser = "There's been a error.\nPlease go back and try again."
    switch (this.getVerificationError()) {
      case AuthError.NOT_SENIOR:
        messageToUser = 'JumboSmash is only open to Tufts seniors.'
        break
      case AuthError.NOT_TUFTS:
        messageToUser = 'JumboSmash is only open to Tufts students.'
        break
    }

    let bottomSection = null
    if (this.getVerificationError() === AuthError.NOT_SENIOR) {
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
            <MaterialIcons name='error-outline' size={75} color={getLightColor()} />
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
      email={this.props.authState.email}
      requestResend={this.requestResend}
      submitVerificationCode={this.submitVerificationCode}
      authError={this.state.shouldForceShowVerifyingOverlay ? undefined : this.getVerificationError()}
      clearAuthErrorMessages={this.props.clearAuthErrorMessages}
      ref={ref => this.checkEmailScreen = ref}
      waitingForVerificationResponse={this.props.authState.verified.loading}
      codeLength={CODE_LENGTH}
    />
  )

  private getVerificationError = () => {
    if (this.state.shouldForceShowVerifyingOverlay) {
      return AuthError.NO_ERROR
    }
    return getAuthErrorFromMessage(this.props.authState.verified.errorMessage)
  }

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
      email: this.props.authState.email,
    }
    this.props.requestVerification(credentials)
  }

  private goBack = () => {
    this.props.navigation.goBack()
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    authState: state.auth,
    classYear: state.profile.classYear,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    requestVerification: (credentials: Credentials) => dispatch(requestVerification(credentials, true)),
    submitVerificationCode: (code: string) => dispatch(verifyEmail(code)),
    clearAuthErrorMessages: () => dispatch(clearAuthErrorMessages()),
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
