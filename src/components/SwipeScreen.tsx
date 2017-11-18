import React, { PureComponent } from 'react'
import { connect, Dispatch } from 'react-redux'
import { View, Text, Button, StyleSheet } from 'react-native'
import { NavigationTabScreenOptions } from 'react-navigation'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { logout } from '../services/auth'
import { RootState } from '../redux'

interface DispatchProps {
  onLogout: () => void
}

type Props = DispatchProps

class SwipeScreen extends PureComponent<Props, {}> {

  static navigationOptions: NavigationTabScreenOptions = {
    tabBarIcon: ({focused, tintColor}) => (
      <FontAwesome
        name={focused ? 'heart' : 'heart-o'}
        size={24}
        style={{ color: tintColor }}
      />
    ),
  }

  public render() {
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
