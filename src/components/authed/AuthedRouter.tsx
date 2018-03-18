import React from 'react'
import { Platform, StyleSheet } from 'react-native'
import {
  TabNavigator,
  StackNavigator,
  NavigationTabScreenOptions
} from 'react-navigation'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import * as Profile from './profile'
import { SwipeScreen } from './swipe'
import MatchesList from './MatchesList'
import ChatScreen from './ChatScreen'
import Ionicons from 'react-native-vector-icons/Ionicons'

const styles = StyleSheet.create({
  iOSTabBar: {
    paddingTop: 15, // extra padding iOS because of status bar
  },
  stackCard: {
    backgroundColor: 'white',
  },
})

const profileScreen = StackNavigator({
  ProfileScreen: {
    screen: Profile.ProfileScreen,
    navigationOptions: {
      header: null, /* tslint:disable-line:no-null-keyword */
    },
  },
  TagsScreen: {
    screen: Profile.TagsScreen,
    navigationOptions: {
      title: 'Choose Tags',
    },
  },
  BlockScreen: {
    screen: Profile.BlockScreen,
    navigationOptions: {
      title: 'Block Users',
    },
  },
}, {
  headerMode: 'screen',
  cardStyle: styles.stackCard,
})

const profileScreenNavigationOptions: NavigationTabScreenOptions = {
  tabBarIcon: ({focused, tintColor}) => (
    <Ionicons
      name={focused ? 'ios-person' : 'ios-person-outline'}
      size={35}
      style={{ color: tintColor }}
    />
  ),
}

const matchesScreen = StackNavigator({
  MatchesList: { screen: MatchesList },
  Chat: { screen: ChatScreen },
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
    screen: profileScreen,
    navigationOptions: profileScreenNavigationOptions,
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
