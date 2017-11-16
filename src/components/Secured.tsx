import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { View, Text, Button, StyleSheet } from 'react-native'
import { logout } from '../services/auth'

interface Props {
  onLogout: () => void
}

class Login extends PureComponent<Props, void> {

  render() {
    return (
      <View style={styles.center}>
        <Text>You are now logged in</Text>
        <Button onPress={this.props.onLogout} title='Logout'/>
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => { dispatch(logout()) },
  }
}

export default connect(undefined, mapDispatchToProps)(Login)

const styles = StyleSheet.create({
  center: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
})
