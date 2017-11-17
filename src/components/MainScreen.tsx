import React, { PureComponent } from 'react'
import { connect, Dispatch } from 'react-redux'
import { StyleSheet, Dimensions } from 'react-native'
import {
  TabViewAnimated,
  TabBar,
  TabBarProps,
  SceneMap
} from 'react-native-tab-view'
import { logout } from '../services/auth'
import { RootState } from '../redux'
import LoginScreen from './LoginScreen'
import ProfileScreen from './ProfileScreen'
import SwipeScreen from './SwipeScreen'
import MatchesScreen from './MatchesScreen'

// for tab view
const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
}

interface StateProps {
  isLoggedIn: boolean
}

interface DispatchProps {
  onLogout: () => void
}

type Props = StateProps & DispatchProps

interface Route {
  key: string
  title: string
}

interface State {
  navState: {
    index: number
    routes: Route[]
  }
}

class MainScreen extends PureComponent<Props, State> {

  private _renderScene = SceneMap({
    profile: () => (<ProfileScreen />),
    swipe: () => <SwipeScreen />,
    matches: () => <MatchesScreen />
  })

  constructor(props: Props) {
    super(props)
    this.state = {
      navState: {
        index: 0,
        routes: [
          { key: 'profile', title: 'Profile' },
          { key: 'swipe', title: 'Swipe' },
          { key: 'matches', title: 'Matches' },
        ]
      }
    }
  }

  render() {
    if (!this.props.isLoggedIn) {
      return <LoginScreen />
    }
    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state.navState}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
        initialLayout={initialLayout}
        swipeEnabled={false}
        animationEnabled={false}
      />
    )
  }

  private _handleIndexChange = (index: number) => {
    this.setState({
      navState: {
        ...this.state.navState,
        index
      }
    })
  }

  private _renderHeader = (props: TabBarProps) => {
    return (
      <TabBar
        {...props}
        tabStyle={styles.tab}
        style={styles.tabBar}
        indicatorStyle={styles.indicator}
        labelStyle={styles.label}
      />)
    }
}

const mapStateToProps = (state: RootState): StateProps => {
    return {
        isLoggedIn: state.auth.isLoggedIn
    }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    onLogout: () => dispatch(logout()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen)

const styles = StyleSheet.create({
  tab: {
    paddingTop: 15
  },
  tabBar: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray'
  },
  indicator: {
    height: 5,
    backgroundColor: 'navy'
  },
  label: {
    color: 'navy'
  },
  container: {
    flex: 1
  },
  center: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
})
