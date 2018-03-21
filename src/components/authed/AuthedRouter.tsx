import { StyleSheet } from 'react-native'
import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation'
import {ChatScreen, MatchesList} from './chat'
import * as Profile from './profile'
import { SwipeScreen } from './swipe'
import TabBar from './TabBar'

const styles = StyleSheet.create({
  tabBar: {
    height: 55,
    elevation: 5,

  },
  iOSTabBar: {
    paddingTop: 15, // extra padding iOS because of status bar
  },
  stackCard: {
    backgroundColor: 'white',
  },
})
const tabNavigator = TabNavigator({
  Profile: {
    screen: Profile.ProfileScreen,
  },
  Swipe: {
    screen: SwipeScreen,
  },
  Matches: {
    screen: MatchesList,
  },
}, {
  tabBarComponent: TabBar,
  tabBarPosition: 'top',
  animationEnabled: false,
  swipeEnabled: false,
  tabBarOptions: {
    showLabel: false,
    showIcon: true,
  },
})

export default StackNavigator({
  Main: {
    screen: tabNavigator,
  },
  TagsScreen: {
    screen: Profile.TagsScreen,
  },
  BlockScreen: {
    screen: Profile.BlockScreen,
  },
  ReviewCoCScreen: {
    screen: Profile.ReviewCoCScreen,
  },
  Chat: {
    screen: ChatScreen,
  },
}, {
  headerMode: 'none',
  cardStyle: styles.stackCard,
})
