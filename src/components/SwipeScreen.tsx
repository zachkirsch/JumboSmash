import React, { PureComponent } from 'react'
import { connect, Dispatch } from 'react-redux'
import { View, Text, Button, StyleSheet } from 'react-native'
import { logout } from '../services/auth'
import { RootState } from '../redux'

interface DispatchProps {
  onLogout: () => void
}

type Props = DispatchProps

class SwipeScreen extends PureComponent<Props, {}> {
  render() {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>This is the swiping screen</Text>
        <Button onPress={this.props.onLogout} title='Logout'/>
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    onLogout: () => dispatch(logout()),
  }
}

export default connect(undefined, mapDispatchToProps)(SwipeScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  center: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
})
