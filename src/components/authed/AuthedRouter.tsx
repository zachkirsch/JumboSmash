import { StyleSheet } from 'react-native'
import {
  TabNavigator,
  StackNavigator,
} from 'react-navigation'
<<<<<<< HEAD
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
=======
import * as Profile from './profile'
import { SwipeScreen } from './swipe'
import {ChatScreen, MatchesList} from './chat'
import TabBar from './TabBar'
>>>>>>> 8a75548119471601f3ee47b83a0de3962c10cf9c

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
<<<<<<< HEAD

const profileScreen = StackNavigator({
  ProfileScreen: {screen: ProfileScreen},
  ProfileEditScreen: {screen: ProfileEditScreen},
  CodeOfConductScreen: {screen: CodeOfConductScreen},
  TagsScreen: {screen: TagsScreen},
  SettingsScreen: {screen: SettingsScreen},
  CoCPrivacyScreen: {screen: CoCPrivacyScreen},
  ReportScreen: {screen: ReportScreen},
  BlockScreen: {screen: BlockScreen},
},{
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
=======
const tabNavigator = TabNavigator({
  Profile: {
    screen: Profile.ProfileScreen,
>>>>>>> 8a75548119471601f3ee47b83a0de3962c10cf9c
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
