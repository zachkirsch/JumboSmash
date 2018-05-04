import { NavigationActions } from 'react-navigation'

interface NavigationServiceType {
  router?: any /* tslint:disable-line:no-any */
  setRouter: (router: any) => void /* tslint:disable-line:no-any */
  openChat: (conversationId: string) => void
  chatIsOpen: (conversationId: string) => boolean
  popChatIfOpen: (conversationId: string) => void
}

/* tslint:disable-next-line:variable-name */
export const NavigationService: NavigationServiceType = {
  /* tslint:disable-next-line:no-any */
  setRouter: (router: any) => NavigationService.router = router,
  openChat: (conversationId: string) => {
    if (!NavigationService.router) {
      return
    }
    const onChatScreen = NavigationService.router.state.nav.routes[1] && NavigationService.router.state.nav.routes[1].routeName === 'Chat'
    if (onChatScreen) {
      if (NavigationService.router.state.nav.index > 0) {
        NavigationService.router.dispatch(NavigationActions.popToTop({}))
      }
    }
    NavigationService.router.dispatch(NavigationActions.navigate({
      routeName: 'Chat',
      params: {
        conversationId: conversationId,
      },
    }))
  },
  chatIsOpen: (conversationId: string) => {
    if (!NavigationService.router) {
      return false
    }
    const onChatScreen = NavigationService.router.state.nav.routes[1] && NavigationService.router.state.nav.routes[1].routeName === 'Chat'
    if (onChatScreen) {
      const onConversationScreen = NavigationService.router.state.nav.index > 0
      if (onConversationScreen) {
        return NavigationService.router.state.nav.routes[1].params
               && NavigationService.router.state.nav.routes[1].params.conversationId === conversationId
      }
    }
    return false
  },
  popChatIfOpen: (conversationId: string) => {
    if (!NavigationService.router) {
      return
    }
    if (NavigationService.chatIsOpen(conversationId)) {
      NavigationService.router.dispatch(NavigationActions.popToTop({}))
    }
  },
}
