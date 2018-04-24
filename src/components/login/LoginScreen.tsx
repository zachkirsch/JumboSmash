import React, { PureComponent } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../redux'
import { Credentials, requestVerification } from '../../services/auth'
import { JSButton, JSText, JSTextInput, TextInputRef } from '../common'
import EmailUsFooter from './EmailUsFooter'

interface StateProps {
  email: string
}

interface DispatchProps {
  onSubmitCredentials: (credentials: Credentials) => void
  initialCredentials?: Credentials
}

type Props = NavigationScreenPropsWithRedux<{}, StateProps & DispatchProps>

interface State {
  credentials: Credentials,
  inputErrorMessage: string
  showTextInputPlaceholder: boolean
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

  private textInputRef: TextInputRef | null

  constructor(props: Props) {
    super(props)
    const initialCredentials: Credentials = {
      email: this.props.email || '',
    }

    this.state = {
      credentials: initialCredentials,
      inputErrorMessage: '',
      showTextInputPlaceholder: true,
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
        <KeyboardAvoidingView behavior='padding' style={styles.mainContainer} >
          <View style={styles.messageContainer}>
            <JSText bold style={styles.message}>CLASS OF 2018</JSText>
            <JSText style={styles.message}>IT'S TIME</JSText>
            <JSText style={styles.message}>FOR</JSText>
            <JSText style={styles.message}>SMASHING.</JSText>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.errorMessageContainer}>
              <JSText style={styles.errorMessage}>
                {errorMsg}
              </JSText>
            </View>
            <JSTextInput
              placeholder={'Tufts E-mail Address'}
              onChangeText={this.onChangeEmail}
              value={this.state.credentials.email}
              autoCapitalize='none'
              autoCorrect={false}
              keyboardType={'email-address'}
              onSubmitEditing={this.onSubmitCredentials}
              returnKeyType={'go'}
              style={styles.emailInput}
              enablesReturnKeyAutomatically
              selectTextOnFocus
              fancy
              textInputRef={this.setTextInputRef}
            />
          </View>
        </KeyboardAvoidingView>
        <View style={styles.submitContainer}>
          <View style={styles.submitButtonContainer}>
            <JSButton onPress={this.onSubmitCredentials} label='Log In' />
          </View>
          <EmailUsFooter />
        </View>
      </ScrollView>
    )
  }

  private setTextInputRef = (ref: TextInputRef) => this.textInputRef = ref

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
      this.props.onSubmitCredentials({
        email: this.state.credentials.email.toLowerCase(),
      })
      this.props.navigation.navigate('VerifyEmailScreen', {
        focusKeyboardOnLoginScreen: () => this.textInputRef && this.textInputRef.focus(),
      })
    }
  }

}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    email: state.auth.email,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    onSubmitCredentials: (credentials: Credentials) => dispatch(requestVerification(credentials)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    paddingTop: 100,
    flex: 2,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: '10%',
  },
  message: {
    fontSize: 21,
    lineHeight: 29,
    color: 'black',
  },
  inputContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  errorMessageContainer: {
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 5 : -5,
  },
  errorMessage: {
    color: 'red',
  },
  submitContainer: {
    flex: 1.8,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  submitButtonContainer: {
    flex: 4,
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  emailInput: {
    marginHorizontal: 30,
  },
})
