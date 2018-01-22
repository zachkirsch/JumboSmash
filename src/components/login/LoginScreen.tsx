import React, { PureComponent } from 'react'
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { Credentials } from '../../services/auth'

interface OwnProps {
  onSubmitCredentials: (credentials: Credentials) => void
  initialCredentials?: Credentials
  authErrorMessage?: string
}

type Props = OwnProps

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

class LoginScreen extends PureComponent<Props, State> {

  constructor (props: Props) {
    super(props)

    const initialCredentials: Credentials = this.props.initialCredentials || {
      email: '',
    }

    this.state = {
      credentials: initialCredentials,
      inputErrorMessage: '',
    }
  }

  public render() {

    // default is ' ' so that it's never empty (and so it always takes up space)
    const errorMsg = this.state.inputErrorMessage || this.props.authErrorMessage || ' '

    return (
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps='handled'
        scrollEnabled={false}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../../img/jumbosmash_logo.png')}
            style={styles.logo}
          />
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
            enablesReturnKeyAutomatically={true}
            onSubmitEditing={this.onSubmitCredentials}
            returnKeyType={'next'}
            autoFocus
          />
        </View>
        <View style={styles.submitContainer}>
          <TouchableOpacity
            onPress={this.onSubmitCredentials}
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>
              {'VERIFY'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }

  private onChangeCredentials = (credentials: Partial<Credentials>) => {
    this.setState({
      credentials: {
        ...this.state.credentials,
        ...credentials,
      },
    })
  }

  private onChangeEmail = (email: string) => this.onChangeCredentials({email})

  private getEmailInputError = (email: string): EmailInputError => {
    if (email === undefined) {
      return EmailInputError.EmptyEmail
    }
    email = this.state.credentials.email.trim().toLowerCase()
    if (!EMAIL_REGEX.test(email)) {
      return EmailInputError.NotEmailAddress
    }
    if (!email.endsWith('@tufts.edu')) {
      return EmailInputError.NotTuftsEmail
    }
    return EmailInputError.None
  }

  private getErrorMessage = (): string => {
    switch (this.getEmailInputError(this.state.credentials.email)) {
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
    const errorMessage: string = this.getErrorMessage()
    this.setState({
      inputErrorMessage: errorMessage,
    }, () => {
      if (!errorMessage) {
        this.props.onSubmitCredentials(this.state.credentials)
      }
    })
  }

}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  logoContainer: {
    flex: 3,
    justifyContent: 'flex-end',
  },
  logo: {
    flex: 0.75,
    width: undefined,
    height: undefined,
    resizeMode: 'contain',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  errorMessageContainer: {
    alignItems: 'center',
  },
  errorMessage: {
    color: 'red',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'lightgray',
    borderWidth: 1,
    marginVertical: 5,
    marginHorizontal: 40,
    padding: 5,
    borderRadius: 5,
  },
  submitContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  submitButton: {
    backgroundColor: 'lightgray',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  submitButtonText: {
    fontSize: 20,
  },
})
