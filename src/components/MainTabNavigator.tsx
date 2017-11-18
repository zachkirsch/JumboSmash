import { Platform, StyleSheet } from 'react-native'
import { TabNavigator } from 'react-navigation'
import ProfileScreen from './ProfileScreen'
import SwipeScreen from './SwipeScreen'
import MatchesScreen from './MatchesScreen'

const styles = StyleSheet.create({
  tabBarStyle: {
    paddingTop: 15
  }
})

export default TabNavigator({
  Profile: {
    screen: ProfileScreen
  },
  Swipe: {
    screen: SwipeScreen
  },
  Matches: {
    screen: MatchesScreen
  },
}, {
  tabBarPosition: 'top',
  tabBarOptions: {
    showLabel: false,
    showIcon: true,
    style: Platform.OS === 'ios' ? styles.tabBarStyle : undefined,
  }
})
