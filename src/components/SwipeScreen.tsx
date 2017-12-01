import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { NavigationTabScreenOptions } from 'react-navigation'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

class SwipeScreen extends PureComponent<{}, {}> {

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
      </View>
    )
  }
}

export default SwipeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
