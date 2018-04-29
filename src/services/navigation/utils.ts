import { NavigationAction, NavigationActions } from 'react-navigation'

/* tslint:disable-next-line:variable-name */
export const NavigationService = {
  /* tslint:disable-next-line:no-any */
  openChat: (router: any, conversationId: string) => {
    if (!router) {
      return
    }
    let actions: NavigationAction[] = []

    const onChatScreen = router.state.nav.routes[1] && router.state.nav.routes[1].routeName === 'Chat'
    if (onChatScreen) {
      if (router.state.nav.index > 0) {
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

    actions.forEach(action => router.dispatch(action))
  },
}
