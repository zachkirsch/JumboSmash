import { StyleSheet } from 'react-native'
import { StackNavigator } from 'react-navigation'
import LoginScreen from './LoginScreen'
import VerifyEmailScreen from './VerifyEmailScreen'

const styles = StyleSheet.create({
  stackCard: {
    backgroundColor: 'white',
  },
})

export default StackNavigator({
  LoginScreen: { screen: LoginScreen },
  VerifyEmailScreen: { screen: VerifyEmailScreen },
}, {
  headerMode: 'none',
  cardStyle: styles.stackCard,
})
