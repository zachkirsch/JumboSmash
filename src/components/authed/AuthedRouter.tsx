import React from 'react'
import { Platform, StyleSheet } from 'react-native'
import {
  TabNavigator,
  StackNavigator,
  NavigationTabScreenOptions
} from 'react-navigation'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ProfileScreen from './ProfileScreen'
import ProfileEditScreen from './ProfileEditScreen'
import { SwipeScreen } from './swipe'
import MatchesList from './MatchesList'
import ChatScreen from './ChatScreen'
import CodeOfConductScreen from './CoCPrivacyScreen'
import TagsScreen from './TagsScreen';
import CoCPrivacyScreen from './CoCPrivacyScreen';
import ReportScreen from './ReportScreen';
import BlockScreen from './BlockScreen';
import Ionicons from 'react-native-vector-icons/Ionicons'
import SettingsScreen from './SettingsScreen';

const styles = StyleSheet.create({
  iOSTabBar: {
    paddingTop: 15, // extra padding iOS because of status bar
  },
  stackCard: {
    backgroundColor: 'white',
  },
})

const profileScreen = StackNavigator({
  ProfileEditScreen: {screen: ProfileEditScreen},
  CodeOfConductScreen: {screen: CodeOfConductScreen},
  TagsScreen: {screen: TagsScreen},
  SettingsScreen: {screen: SettingsScreen},
  CoCPrivacyScreen: {screen: CoCPrivacyScreen},
  ReportScreen: {screen: ReportScreen},
  BlockScreen: {screen: BlockScreen},
}, {
  headerMode: 'none',
  cardStyle: styles.stackCard,
  mode: 'modal'
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
    navigationOptions: profileScreenNavigationOptions
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
