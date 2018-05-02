import { NavigationAction, NavigationActions } from 'react-navigation'

/* tslint:disable-next-line:variable-name */
export const NavigationService = {
  /* tslint:disable-next-line:no-any */
  setRouter: (router: any) => this.router = router,
  openChat: (conversationId: string) => {
    if (!this.router) {
      return
    }
    let actions: NavigationAction[] = []

    const onChatScreen = this.router.state.nav.routes[1] && this.router.state.nav.routes[1].routeName === 'Chat'
    if (onChatScreen) {
      if (this.router.state.nav.index > 0) {
        actions.push(NavigationActions.popToTop({}))
      }
    /*
    } else {
      actions.push(NavigationActions.navigate({
        routeName: 'Matches',
      }))
    */
    }
    actions.push(NavigationActions.navigate({
      routeName: 'Chat',
      params: {
        conversationId: conversationId,
      },
    }))

    actions.forEach(action => this.router.dispatch(action))
  },
}
