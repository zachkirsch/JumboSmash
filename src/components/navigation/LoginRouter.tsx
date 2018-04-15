import { TabNavigator } from 'react-navigation'
import CodeOfConductScreen from '../login/CodeOfConductScreen'
import LoginScreen from '../login/LoginScreen'
import VerifyEmailScreen from '../login/VerifyEmailScreen'
import CountdownScreen from '../login/CountdownScreen'

export default TabNavigator({
  CountdownScreen: {
    screen: CountdownScreen,
    navigationOptions: {
      tabBarVisible: false,
    },
  },
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
 },
{
  swipeEnabled: false,
  animationEnabled: true,
  lazy: true,
})
