import { NavigationActions } from 'react-navigation'

/* tslint:disable-next-line:variable-name */
export const NavigationService = {
  /* tslint:disable-next-line:no-any */
  setRouter: (router: any) => this.router = router,
  openChat: (conversationId: string) => {
    if (!this.router) {
      return
    }
    const onChatScreen = this.router.state.nav.routes[1] && this.router.state.nav.routes[1].routeName === 'Chat'
    if (onChatScreen) {
      if (this.router.state.nav.index > 0) {
        this.router.dispatch(NavigationActions.popToTop({}))
      }
    }
    this.router.dispatch(NavigationActions.navigate({
      routeName: 'Chat',
      params: {
        conversationId: conversationId,
      },
    }))
  },
  chatIsOpen: (conversationId: string) => {
    const onChatScreen = this.router.state.nav.routes[1] && this.router.state.nav.routes[1].routeName === 'Chat'
    if (onChatScreen) {
      const onConversationScreen = this.router.state.nav.index > 0
      if (onConversationScreen) {
        return this.router.state.nav.routes[1].params
               && this.router.state.nav.routes[1].params.conversationId === conversationId
      }
    }
    return false
  },
  popChatIfOpen: (conversationId: string) => {
    if (!this.router) {
      return
    }
    if (this.chatIsOpen(conversationId)) {
      this.router.dispatch(NavigationActions.popToTop({}))
    }
  },
}
