import React, { PureComponent } from 'react'
import { connect, Dispatch } from 'react-redux'
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'
import { login, Credentials } from '../services/auth'
import { RootState } from '../redux'

interface StateProps {
  username: string
  errorMessage: string
}

interface DispatchProps {
  onLogin: (credentials: Credentials) => void
}

type Props = StateProps & DispatchProps

interface State {
  credentials: Credentials
}

class Login extends PureComponent<Props, State> {

  constructor (props: Props) {
    super(props)
    this.state = {
      credentials: {
        username: this.props.username,
        password: ''
      }
    }
  }

  onLogin = () => {
    this.props.onLogin(this.state.credentials)
  }

  onChangeCredentials = (credentials: Partial<Credentials>) => {
    this.setState({
      credentials: Object.assign({}, this.state.credentials, credentials)
    })
  }

  onChangeUsername = (username: string) => this.onChangeCredentials({username})
  onChangPassword = (password: string) => this.onChangeCredentials({password})

  render() {
    return (
      <View style={[styles.container, styles.center]}>

        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessage}>{this.props.errorMessage}</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder='fakeuser'
          onChangeText={this.onChangeUsername}
          value={this.state.credentials.username}
          autoCapitalize='none'
        />
        <TextInput
          style={styles.input}
          placeholder='password'
          onChangeText={this.onChangPassword}
          value={this.state.credentials.password}
          autoCapitalize='none'
          secureTextEntry={true}
        />
        <Button onPress={this.onLogin} title='Login'/>
      </View>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    username: state.auth.username,
    errorMessage: state.auth.errorMessage
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState> ): DispatchProps => {
  return {
    onLogin: (credentials: Credentials) => dispatch(login(credentials)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)

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
