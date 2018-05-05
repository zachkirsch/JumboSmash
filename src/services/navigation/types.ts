export type RouteName = 'Profile' | 'Swipe' | 'Matches'

export interface NavigationState {
  tabBarOverlay?: () => JSX.Element
  selectedTab?: RouteName
  shouldShowChatIndicator?: boolean
}
