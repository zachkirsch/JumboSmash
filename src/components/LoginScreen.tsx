import React, { PureComponent } from 'react'
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'
import { Credentials } from '../services/auth'

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

    const errorMsg = this.state.inputErrorMessage || this.props.authErrorMessage

    return (
      <View style={[styles.container, styles.center]}>
        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessage}>
            {errorMsg}
          </Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder='E-mail Address'
          onChangeText={this.onChangeEmail}
          value={this.state.credentials.email}
          autoCapitalize='none'
          autoCorrect={false}
          keyboardType={'email-address'}
          enablesReturnKeyAutomatically={true}
          onSubmitEditing={this.onSubmitCredentials}
          returnKeyType={'next'}
          autoFocus={true}
        />
        <Button onPress={this.onSubmitCredentials} title='Get Code'/>
      </View>
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
  center: {
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 5,
    padding: 5,
  },
  errorMessageContainer: {
    alignItems: 'center',
  },
  errorMessage: {
    color: 'red',
    fontWeight: 'bold',
  },
})
