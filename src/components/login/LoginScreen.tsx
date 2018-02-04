import React, { PureComponent } from 'react'
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Linking } from 'react-native'
import { connect, Dispatch } from 'react-redux'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import LinearGradient from 'react-native-linear-gradient'
import { requestVerification, Credentials } from '../../services/auth'
import { RootState } from '../../redux'

interface StateProps {
  email: string
}

interface DispatchProps {
  onSubmitCredentials: (credentials: Credentials) => void
  initialCredentials?: Credentials
}

const JUMBOSMASH_EMAIL = 'help@jumbosmash.com'

type Props = NavigationScreenPropsWithRedux<{}, StateProps & DispatchProps>

interface State {
  credentials: Credentials,
  inputErrorMessage: string
}

enum EmailInputError {
  NotEmailAddress,
  NotTuftsEmail,
  EmptyEmail,
  None,
}

/* tslint:disable-next-line:max-line-length */
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

/* tslint:disable-next-line:max-line-length */
const PARTIAL_TUFTS_EMAIL_REGEX = /^([^@]*|.*@|.*@t|.*@tu|.*@tuf|.*@tuft|.*@tufts|.*@tufts\.|.*@tufts\.e|.*@tufts\.ed|.*@tufts\.edu)$/

class LoginScreen extends PureComponent<Props, State> {

  constructor (props: Props) {
    super(props)
    const initialCredentials: Credentials = {
      email: this.props.email || '',
    }

    this.state = {
      credentials: initialCredentials,
      inputErrorMessage: '',
    }
  }

  public render() {

    // default is ' ' so that it's never empty (and so it always takes up space)
    const errorMsg = this.state.inputErrorMessage || ' '

    return (
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps='handled'
        scrollEnabled={false}
      >
        <View style={styles.headerContainer} />
        <View style={styles.mainContainer} >
          <View style={styles.messageContainer}>
            <Text style={[styles.message, styles.bold]}>CLASS OF 2018</Text>
            <Text style={styles.message}>IT'S TIME</Text>
            <Text style={styles.message}>FOR</Text>
            <Text style={styles.message}>SMASHING.</Text>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.errorMessageContainer}>
              <Text style={styles.errorMessage}>
                {errorMsg}
              </Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder='Tufts E-mail Address'
              onChangeText={this.onChangeEmail}
              value={this.state.credentials.email}
              autoCapitalize='none'
              autoCorrect={false}
              keyboardType={'email-address'}
              onSubmitEditing={this.onSubmitCredentials}
              returnKeyType={'go'}
              autoFocus
              enablesReturnKeyAutomatically
            />
          </View>
        </View>
        <View style={styles.submitContainer}>
          <View style={styles.submitButtonContainer}>
            <LinearGradient
              colors={['rgb(243,239,254)', 'rgb(224,213,249)']}
              start={{x: 0, y: 1}} end={{x: 1, y: 1}}
              locations={[0.5, 1]}
              style={styles.linearGradient}
            >
              <TouchableOpacity
                onPress={this.onSubmitCredentials}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>
                  Verify
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          <View style={styles.emailUsContainer}>
            <TouchableOpacity
              onPress={this.sendUsEmail}
            >
              <Text style={styles.emailUsText}>
                Got a question? Email us.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    )
  }

  private onChangeCredentials = (credentials: Credentials) => {
    const couldBeTuftsEmail = this.couldBeTuftsEmail(credentials.email)
    this.setState({
      credentials: {
        ...this.state.credentials,
        ...credentials,
      },
      inputErrorMessage: couldBeTuftsEmail ? '' : this.getErrorMessage(EmailInputError.NotTuftsEmail),
    })
  }

  private couldBeTuftsEmail = (email?: string) => {
    if (email === undefined) {
      email = this.state.credentials.email
    }
    return PARTIAL_TUFTS_EMAIL_REGEX.test(email)
  }

  private onChangeEmail = (email: string) => this.onChangeCredentials({email})

  private getEmailInputError = (email: string): EmailInputError => {
    if (email === undefined) {
      return EmailInputError.EmptyEmail
    }
    email = this.state.credentials.email.trim().toLowerCase()
    if (email.length === 0) {
      return EmailInputError.EmptyEmail
    }
    if (!EMAIL_REGEX.test(email)) {
      return EmailInputError.NotEmailAddress
    }
    if (!email.endsWith('@tufts.edu')) {
      return EmailInputError.NotTuftsEmail
    }
    return EmailInputError.None
  }

  private getErrorMessage = (error: EmailInputError): string => {
    switch (error) {
      case EmailInputError.NotTuftsEmail:
        return 'You must use a Tufts e-mail address'
      case EmailInputError.NotEmailAddress:
      case EmailInputError.EmptyEmail:
        return 'You must enter an e-mail address'
      case EmailInputError.None:
        return ''
    }
  }

  private onSubmitCredentials = () => {
    const errorMessage: string = this.getErrorMessage(this.getEmailInputError(this.state.credentials.email))
    if (errorMessage) {
      this.setState({
        inputErrorMessage: errorMessage,
      })
    } else {
      this.props.onSubmitCredentials(this.state.credentials)
      this.props.navigation.navigate('VerifyEmailScreen', {credentials: this.state.credentials})
    }
  }

  private sendUsEmail = () => {
    const subject = 'I need help with JumboSmash'
    Linking.openURL(`mailto://${JUMBOSMASH_EMAIL}?subject=${subject}`)
  }

}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    email: state.auth.email,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState> ): DispatchProps => {
  return {
    onSubmitCredentials: (credentials: Credentials) => dispatch(requestVerification(credentials)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  headerContainer: {
    flex: 0.9,
  },
  mainContainer: {
    flex: 2,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: '10%',
  },
  message: {
    fontSize: 21,
    fontFamily: 'Avenir',
    lineHeight: 29,
    fontWeight: '300',
  },
  inputContainer: {
    justifyContent: 'center',
    backgroundColor: 'white',
    flex: 1,
  },
  bold: {
    fontFamily: 'Avenir-Heavy',
    fontWeight: '800',
  },
  errorMessageContainer: {
    alignItems: 'center',
  },
  errorMessage: {
    color: 'red',
    fontWeight: '500',
    fontFamily: 'Avenir',
  },
  input: {
    shadowColor: 'rgb(238,219,249)',
    shadowOpacity: 1,
    shadowRadius: 50,
    height: 50,
    marginVertical: 5,
    marginHorizontal: 45,
    padding: 10,
    fontSize: 15,
    fontWeight: '300',
    fontFamily: 'Avenir',
  },
  submitContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  submitButton: {
    paddingVertical: 10,
    paddingHorizontal: 60,
  },
  submitButtonText: {
    fontSize: 14,
    lineHeight: 19,
    backgroundColor: 'transparent',
    fontFamily: 'Avenir',
    marginVertical: 5,
    color: '#4A4A4A',
  },
  linearGradient: {
    borderRadius: 21,
  },
  emailUsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  emailUsText: {
    fontSize: 14,
    lineHeight: 14,
    padding: 10,
    fontWeight: '300',
    fontFamily: 'Avenir',
    color: 'rgba(74,74,74,0.84)',
  },
})
