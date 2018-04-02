import { NavigationScreenProps, NavigationScreenProp, NavigationStateRoute } from 'react-navigation'

declare module 'react-navigation' {

  export type NavigationScreenPropsWithOwnProps<OwnProps> =  {
    navigation: NavigationScreenProp<{
      key: string
      routeName: string
      path?: string
      params: OwnProps
    }>
  }

  export type NavigationScreenPropsWithRedux<OwnProps, ReduxProps> = ReduxProps & NavigationScreenProps
  & NavigationScreenPropsWithOwnProps<OwnProps>
  & {
    navigation: {
      addListener: (event:  'willFocus' | 'didFocus' | 'willBlur' | 'didBlur', callback: () => void) => void
    },
  }
}
