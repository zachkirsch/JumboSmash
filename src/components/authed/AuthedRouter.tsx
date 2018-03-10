import React from 'react'
import { Platform, StyleSheet } from 'react-native'
import {
  TabNavigator,
  StackNavigator,
  NavigationTabScreenOptions
} from 'react-navigation'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ProfileScreen from './ProfileScreen'
import SwipeScreen from './SwipeScreen'
import MatchesList from './MatchesList'
import ChatScreen from './ChatScreen'

const styles = StyleSheet.create({
  iOSTabBar: {
    paddingTop: 15, // extra padding iOS because of status bar
  },
  stackCard: {
    backgroundColor: 'white',
  },
})

const matchesScreen = StackNavigator({
  MatchesList: { screen: MatchesList },
  Chat: {
    screen: ChatScreen,
    navigationOptions: {
      tabBarVisible: false,
    },
  },
}, {
  headerMode: 'none',
  cardStyle: styles.stackCard,
})

const matchesScreenNavigationOptions: NavigationTabScreenOptions = {
  tabBarIcon: ({focused, tintColor}) => (
    <MaterialIcons
      name={focused ? 'chat-bubble' : 'chat-bubble-outline'}
      size={26}
      style={{ color: tintColor }}
    />
  ),
}

export default TabNavigator({
  Profile: {
    screen: ProfileScreen,
  },
  Swipe: {
    screen: SwipeScreen,
  },
  Matches: {
    screen: matchesScreen,
    navigationOptions: matchesScreenNavigationOptions,
  },
}, {
  tabBarPosition: 'top',
  swipeEnabled: false,
  tabBarOptions: {
    showLabel: false,
    showIcon: true,
    style: Platform.OS === 'ios' ? styles.iOSTabBar : undefined,
  },
})
