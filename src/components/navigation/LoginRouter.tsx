import React from 'react'
import { StyleSheet } from 'react-native'
import { TabNavigator, StackNavigator, NavigationRouteConfig, NavigationScreenProp, NavigationRoute } from 'react-navigation'
import AcceptCoCScreen from '../login/AcceptCoCScreen'
import LoginScreen from '../login/LoginScreen'
import VerifyEmailScreen from '../login/VerifyEmailScreen'
import ConfirmLocationScreen from '../login/ConfirmLocationScreen'
import TutorialScreen from '../login/TutorialScreen'
import CountdownScreen from '../login/CountdownScreen'
import * as Profile from '../authed/profile'
import { AuthState } from '../../services/auth'
import { reduxStore } from '../../redux'

const styles = StyleSheet.create({
  stackCard: {
    backgroundColor: 'white',
  },
})

export enum LoginRoute {
  CountdownScreen = 'CountdownScreen',
  LoginScreen = 'LoginScreen',
  VerifyEmailScreen = 'VerifyEmailScreen',
  ConfirmLocationScreen = 'ConfirmLocationScreen',
  AcceptCoCScreen = 'AcceptCoCScreen',
  TutorialScreen = 'TutorialScreen',
  ProfileScreen = 'ProfileScreen',
  TagsScreenInitial = 'TagsScreenInitial',
  BlockUsersInitial = 'BlockUsersInitial',
}

export const goToNextRoute = (navigation: NavigationScreenProp<NavigationRoute>) => {
  const nextRoute = getNextPostLoginRoute(navigation.state.routeName)
  if (nextRoute) {
    navigation.navigate(nextRoute.key)
  }
}

/* tslint:disable:no-switch-case-fall-through */
const getNextPostLoginRoute = (currentRoute?: string) => {
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
      if (state.profile.images.filter(i => !!i && !i.value.isLocal && !!i.value.uri).size > 0) {
        return undefined
      }
      if (!state.profile.tags.value.find(section => !!section.tags.find(tag => !!tag && !!tag.selected))) {
        return {
          key: LoginRoute.TagsScreenInitial,
          screen: props => <Profile.TagsScreen {...props} setupMode />,
        }
      }
  }

  if (currentRoute === LoginRoute.TagsScreenInitial) {
    return {
      key: LoginRoute.BlockUsersInitial,
      screen: props => <Profile.BlockScreen {...props} setupMode />,
    }
  }

  if (currentRoute === LoginRoute.ProfileScreen) {
    return undefined
  }

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
      cardStyle: styles.stackCard,
    }),
  }
}
/* tslint:enable:no-switch-case-fall-through */

const getPostLoginScreens = () => {
  let screens: { [key: string]: NavigationRouteConfig } = {}
  let routeName
  do {
    const nextRoute = getNextPostLoginRoute(routeName)
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

export const generateLoginRouter = () => {
  const screens: { [key: string]: NavigationRouteConfig } = {}
  const state = reduxStore.getState()
  if (!state.time.postRelease) {
    screens[LoginRoute.CountdownScreen] = {
      screen: CountdownScreen,
      navigationOptions: {
        tabBarVisible: false,
      },
    }
  }
  screens[LoginRoute.LoginScreen] = StackNavigator({
    Login: {
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
      headerMode: 'none',
      cardStyle: styles.stackCard,
    })
  return TabNavigator(screens, {
    swipeEnabled: false,
    animationEnabled: true,
    lazy: false,
  })
}

export const generatePostLoginRouter = () => TabNavigator(getPostLoginScreens(), {
  swipeEnabled: false,
  animationEnabled: true,
  lazy: false,
})
