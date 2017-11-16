import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { View, TextInput, Button, StyleSheet } from 'react-native'
import { login, Credentials } from '../actions/auth'

interface Props {
  onLogin: (credentials: Credentials) => void
}

interface State {
  credentials: Credentials
}

class Login extends PureComponent<Props, State> {

  constructor (props) {
    super(props)
    this.state = {
      credentials: {
        username: '',
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

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (credentials: Credentials) => dispatch(login(credentials)),
  }
}

export default connect(undefined, mapDispatchToProps)(Login)

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
  }
})
