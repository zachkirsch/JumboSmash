import { TabNavigator } from 'react-navigation'
import CodeOfConductScreen from './CodeOfConductScreen'
import LoginScreen from './LoginScreen'
import VerifyEmailScreen from './VerifyEmailScreen'

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
