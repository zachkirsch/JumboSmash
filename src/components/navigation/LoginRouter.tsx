import { StyleSheet } from 'react-native'
import { TabNavigator, StackNavigator, NavigationRouteConfig, NavigationScreenProp, NavigationRoute } from 'react-navigation'
import AcceptCoCScreen from '../login/AcceptCoCScreen'
import LoginScreen from '../login/LoginScreen'
import VerifyEmailScreen from '../login/VerifyEmailScreen'
import ConfirmLocationScreen from '../login/ConfirmLocationScreen'
import TutorialScreen from '../login/TutorialScreen'
import * as Profile from '../authed/profile'
import { AuthState } from '../../services/auth'
import { reduxStore } from '../../redux'

const styles = StyleSheet.create({
  stackCard: {
    backgroundColor: 'white',
  },
})

export enum LoginRoute {
  LoginScreen = 'LoginScreen',
  VerifyEmailScreen = 'VerifyEmailScreen',
  ConfirmLocationScreen = 'ConfirmLocationScreen',
  AcceptCoCScreen = 'AcceptCoCScreen',
  TutorialScreen = 'TutorialScreen',
  ProfileScreen = 'ProfileScreen',
}

export const goToNextRoute = (navigation: NavigationScreenProp<NavigationRoute>) => {
  const nextRoute = getNextRoute(navigation.state.routeName)
  if (nextRoute) {
    navigation.navigate(nextRoute.key)
  }
}

/* tslint:disable:no-switch-case-fall-through */
const getNextRoute = (currentRoute?: string) => {
  const state = reduxStore.getState()
  const authState: AuthState = state.auth
  switch (currentRoute) {
    case undefined:
      if (state.profile.classYear !== 18) {
        return {
          key: LoginRoute.ConfirmLocationScreen,
          screen: ConfirmLocationScreen,
        }
      }
    case LoginRoute.ConfirmLocationScreen:
      if (!authState.codeOfConductAccepted) {
        return {
          key: LoginRoute.AcceptCoCScreen,
          screen: AcceptCoCScreen,
        }
      }
    case LoginRoute.AcceptCoCScreen:
      if (!authState.tutorialFinished) {
        return {
          key: LoginRoute.TutorialScreen,
          screen: TutorialScreen,
        }
      }
    case LoginRoute.TutorialScreen:
      if (state.profile.images.filter(i => !!i && !i.value.isLocal && !!i.value.uri).size === 0) {
        return {
          key: LoginRoute.ProfileScreen,
          screen: StackNavigator({
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
            TagsScreen: {
              screen: Profile.TagsScreen,
            },
            BlockScreen: {
              screen: Profile.BlockScreen,
            },
            ReviewCoCScreen: {
              screen: Profile.ReviewCoCScreen,
            },
          }, {
            headerMode: 'none',
          }),
        }
      }
    default:
      return undefined
  }
}
/* tslint:enable:no-switch-case-fall-through */

const getScreens = () => {
  let screens: { [key: string]: NavigationRouteConfig } = {}
  let routeName
  do {
    const nextRoute = getNextRoute(routeName)
    routeName = nextRoute && nextRoute.key
    if (nextRoute) {
      screens[routeName!] = {
        screen: nextRoute.screen,
        navigationOptions: {
          tabBarVisible: false,
        },
      }
    }
  } while (routeName !== undefined)
  return screens
}

export const generateLoginRouter = () => TabNavigator({
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
}, {
  swipeEnabled: false,
  animationEnabled: true,
  lazy: false,
})

export const generatePostLoginRouter = () => TabNavigator(getScreens(), {
  swipeEnabled: false,
  animationEnabled: true,
  lazy: false,
})
