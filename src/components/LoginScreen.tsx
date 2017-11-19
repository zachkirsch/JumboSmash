import React, { PureComponent } from 'react'
import { connect, Dispatch } from 'react-redux'
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'
import { login, Credentials } from '../services/auth'
import { RootState } from '../redux'

interface StateProps {
  email: string
  errorMessage: string
}

interface DispatchProps {
  onLogin: (credentials: Credentials) => void
}

type Props = StateProps & DispatchProps

interface State {
  credentials: Credentials
}

class LoginScreen extends PureComponent<Props, State> {

  constructor (props: Props) {
    super(props)
    this.state = {
      credentials: {
        email: this.props.email,
      }
    }
  }

  onLogin = () => {
    this.props.onLogin(this.state.credentials)
  }

  onChangeCredentials = (credentials: Partial<Credentials>) => {
    this.setState({
      credentials: {
        ...this.state.credentials,
        ...credentials
      }
    })
  }

  onChangeEmail = (email: string) => this.onChangeCredentials({email})

  public render() {
    return (
      <View style={[styles.container, styles.center]}>

        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessage}>{this.props.errorMessage}</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder='E-mail Address'
          onChangeText={this.onChangeEmail}
          value={this.state.credentials.email}
          autoCapitalize='none'
          autoCorrect={false}
        />
        <Button onPress={this.onLogin} title='Login'/>
      </View>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    email: state.auth.email,
    errorMessage: state.auth.errorMessage
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState> ): DispatchProps => {
  return {
    onLogin: (credentials: Credentials) => dispatch(login(credentials)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  center: {
    justifyContent: 'center'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 5,
    padding: 5
  },
  errorMessageContainer: {
    alignItems: 'center'
  },
  errorMessage: {
    color: 'red',
    fontWeight: 'bold',
  }
})
