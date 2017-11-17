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
import Profile from './Profile'
import SwipeScreen from './SwipeScreen'
import Matches from './Matches'

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
}

interface DispatchProps {
  onLogout: () => void
}

type Props = DispatchProps

interface Route {
  key: string
  title: string
}

interface State {
  index: number
  routes: Route[]
}

class Secured extends PureComponent<Props, State> {

  private _renderScene = SceneMap({
    profile: () => (<Profile />),
    swipe: () => <SwipeScreen />,
    matches: () => <Matches />
  })

  constructor(props: Props) {
    super(props)
    this.state = {
      index: 0,
      routes: [
        { key: 'profile', title: 'Profile' },
        { key: 'swipe', title: 'Swipe' },
        { key: 'matches', title: 'Matches' },
      ]
    }
  }

  _handleIndexChange = (index: number) => this.setState({ index })

  _renderHeader = (props: TabBarProps) => {
    return (
      <TabBar
        {...props}
        tabStyle={{paddingTop: 15}}
        style={{backgroundColor: 'transparent', borderBottomWidth: 1, borderBottomColor: 'lightgray'}}
        indicatorStyle={{height: 5, backgroundColor: 'navy'}}
        labelStyle={{color: 'navy'}}
      />)
    }

  render() {
    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
        initialLayout={initialLayout}
        swipeEnabled={false}
        animationEnabled={false}
      />
    )
  }

}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    onLogout: () => dispatch(logout()),
  }
}

export default connect(undefined, mapDispatchToProps)(Secured)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  center: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
})
