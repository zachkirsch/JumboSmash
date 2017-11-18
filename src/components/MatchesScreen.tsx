import React, { PureComponent } from 'react'
import { connect, Dispatch } from 'react-redux'
import { View, Text, Button, StyleSheet } from 'react-native'
import { NavigationTabScreenOptions } from 'react-navigation'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { logout } from '../services/auth'
import { RootState } from '../redux'

interface DispatchProps {
  onLogout: () => void
}

type Props = DispatchProps

class MatchesScreen extends PureComponent<Props, {}> {

  static navigationOptions: NavigationTabScreenOptions = {
    tabBarIcon: ({focused, tintColor}) => (
      <MaterialIcons
        name={focused ? 'chat-bubble' : 'chat-bubble-outline'}
        size={26}
        style={{ color: tintColor }}
      />
    ),
  }

  render() {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>This is the matches screen</Text>
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

export default connect(undefined, mapDispatchToProps)(MatchesScreen)

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
