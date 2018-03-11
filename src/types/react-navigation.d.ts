import { NavigationScreenProps, NavigationScreenProp, NavigationStateRoute } from 'react-navigation'

declare module 'react-navigation' {

  interface NavigationLeafRouteWithOwnProps<OwnProps> {
    key: string
    routeName: string
    path?: string
    params?: OwnProps
  }

  export type NavigationScreenPropsWithRedux<OwnProps, ReduxProps> = ReduxProps & NavigationScreenProps &
  {
    navigation: NavigationScreenProp<NavigationLeafRouteWithOwnProps<OwnProps>>
  } & {
    navigation: {
      addListener: (event:  'willFocus' | 'didFocus' | 'willBlur' | 'didBlur', callback: () => void) => void
    },
  }
}
