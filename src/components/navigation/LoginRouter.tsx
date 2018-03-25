import { TabNavigator } from 'react-navigation'
import CodeOfConductScreen from '../login/CodeOfConductScreen'
import LoginScreen from '../login/LoginScreen'
import VerifyEmailScreen from '../login/VerifyEmailScreen'

export default TabNavigator({
  LoginScreen: {
    screen: LoginScreen,
    navigationOptions: {
      tabBarVisible: false,
    },
  },
  VerifyEmailScreen: {
    screen: VerifyEmailScreen,
    navigationOptions: {
      tabBarVisible: false,
    },
  },
  CodeOfConductScreen: {
    screen: CodeOfConductScreen,
    navigationOptions: {
      tabBarVisible: false,
    },
  },
}, {
  swipeEnabled: false,
  animationEnabled: true,
  lazy: true,
})
