import { NavigationScreenProps } from 'react-navigation'

declare module 'react-navigation' {
  export type NavigationScreenPropsWithRedux<OwnProps, ReduxProps> = ReduxProps & NavigationScreenProps<OwnProps>
}
