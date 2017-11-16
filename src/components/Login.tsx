import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'
import { login, Credentials } from '../services/auth'

interface Props {
  onLogin: (credentials: Credentials) => void
  username: string
  errorMessage: string
}

interface State {
  credentials: Credentials
}

class Login extends PureComponent<Props, State> {

  constructor (props) {
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

  render() {
    return (
      <View style={styles.center}>

        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessage}>{this.props.errorMessage}</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder='fakeuser'
          onChangeText={(username) => this.onChangeCredentials({username})}
          value={this.state.credentials.username}
          autoCapitalize='none'
        />
        <TextInput
          style={styles.input}
          placeholder='password'
          onChangeText={(password) => this.onChangeCredentials({password})}
          value={this.state.credentials.password}
          autoCapitalize='none'
          secureTextEntry={true}
        />
        <Button onPress={this.onLogin} title='Login'/>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    errorMessage: state.auth.errorMessage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (credentials: Credentials) => dispatch(login(credentials)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)

const styles = StyleSheet.create({
  center: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
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
