import { TabNavigator } from 'react-navigation'
import LoginScreen from './LoginScreen'
import VerifyEmailScreen from './VerifyEmailScreen'
import CodeOfConductScreen from './CodeOfConductScreen'

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
