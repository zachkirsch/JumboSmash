import { StyleSheet } from 'react-native'
import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation'
import { ChatScreen, MatchesList } from '../authed/chat'
import * as Profile from '../authed/profile'
import { SwipeScreen } from '../authed/swipe'
import TabBar from './TabBar'

const styles = StyleSheet.create({
  stackCard: {
    backgroundColor: 'white',
  },
})

const tabNavigator = TabNavigator({
  Profile: {
    screen: StackNavigator({
      ProfileEditScreen: {
        screen: Profile.ProfileScreen,
      },
      ProfilePreviewScreen: {
        screen: Profile.ProfilePreviewScreen,
        navigationOptions: {
          gesturesEnabled: false,
        },
      },
    }, {
      mode: 'modal',
      headerMode: 'none',
      cardStyle: styles.stackCard,
    }),
  },
  Swipe: {
    screen: SwipeScreen,
  },
  Matches: {
    screen: MatchesList,
  },
}, {
  lazy: false,
  tabBarComponent: TabBar,
  tabBarPosition: 'top',
  animationEnabled: false,
  swipeEnabled: false,
  tabBarOptions: {
    showLabel: false,
    showIcon: true,
  },
  initialRouteName: 'Swipe',
})

export default StackNavigator({
  Main: {
    screen: tabNavigator,
  },
  TagsScreen: {
    screen: Profile.TagsScreen,
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
  BlockScreen: {
    screen: Profile.BlockScreen,
  },
  MyReactScreen: {
    screen: Profile.MyReactScreen,
  },
  BucketListScreen: {
    screen: Profile.BucketListScreen,
  },
  SeniorEventScreen: {
    screen: Profile.SeniorEventScreen,
  },
  MyEventsScreen: {
    screen: Profile.MyEventsScreen,
  },
  ReviewCoCScreen: {
    screen: Profile.ReviewCoCScreen,
  },
  Chat: {
    screen: ChatScreen,
  },
  ViewProfileScreen: {
    screen: Profile.ProfilePreviewScreen,
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
}, {
  headerMode: 'none',
  cardStyle: styles.stackCard,
})
