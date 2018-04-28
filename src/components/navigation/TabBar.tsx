import React, { PureComponent } from 'react'
import { Animated, Dimensions, Easing, Platform, StyleSheet, TouchableWithoutFeedback, Image, View } from 'react-native'
import { Dispatch, connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import { BlurView } from 'react-native-blur'
import SafeAreaView from 'react-native-safe-area-view'
import {
  NavigationRoute,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation'
import { switchTab, RouteName } from '../../services/navigation'
import { RootState } from '../../redux'
import { xor } from '../../utils'
import { Images } from '../../assets'

interface OwnProps {
  navigation: NavigationScreenProp<NavigationState>
  navigationState: {
    index: number
  }
}

interface StateProps {
  tabBarOverlay?: () => JSX.Element
  shouldShowChatIndicator: boolean
}

interface DispatchProps {
  switchTab: (tab: RouteName) => void
}

type Props = OwnProps & StateProps & DispatchProps

interface State {
  indicatorLeftMargin: Animated.Value
  overlayOpacity: Animated.Value
  overlayPadding: Animated.Value
  showingOverlay: boolean
}

const WIDTH = Dimensions.get('window').width

const INDICATOR_WIDTH = WIDTH / 5
const INDICATOR_HEIGHT = 2

const INITIAL_OVERLAY_PADDING = 10

class TabBar extends PureComponent<Props, State> {

  private tabBarOverlay?: JSX.Element

  constructor(props: Props) {
    super(props)
    this.tabBarOverlay = this.props.tabBarOverlay && this.props.tabBarOverlay()
    this.state = {
      indicatorLeftMargin: new Animated.Value(this.calculateIndicatorLeftMargin(props.navigationState.index)),
      overlayOpacity: new Animated.Value(this.props.tabBarOverlay ? 1 : 0),
      overlayPadding: new Animated.Value(this.props.tabBarOverlay ? 0 : INITIAL_OVERLAY_PADDING),
      showingOverlay: !!this.props.tabBarOverlay,
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.navigationState.index !== nextProps.navigationState.index) {
      Animated.timing(
        this.state.indicatorLeftMargin,
        {
          toValue: this.calculateIndicatorLeftMargin(nextProps.navigationState.index),
          easing: Easing.elastic(1.3),
        }
      ).start()
    }
    if (xor(this.props.tabBarOverlay, nextProps.tabBarOverlay)) {
      if (this.props.tabBarOverlay && !nextProps.tabBarOverlay) {
        Animated.timing(
          this.state.overlayOpacity,
          {
            toValue: 0,
            duration: 100,
          }
        ).start(() => {
          this.setState({
            showingOverlay: false,
          })
          this.state.overlayPadding.setValue(INITIAL_OVERLAY_PADDING)
        })

      } else {
        this.tabBarOverlay = nextProps.tabBarOverlay && nextProps.tabBarOverlay()
        this.setState({
          showingOverlay: true,
        })
        Animated.parallel([
          Animated.timing(
            this.state.overlayOpacity,
            {
              toValue: 1,
              duration: 100,
            }
          ),
          Animated.timing(
            this.state.overlayPadding,
            {
              toValue: 0,
              easing: Easing.bounce,
            }
          ),
        ]).start()
      }
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <View style={styles.buttonsContainer}>
            {this.renderTabButtons()}
          </View>
          {this.renderIndicator()}
        </View>
        {this.renderOverlay()}
      </SafeAreaView>
    )
  }

  private renderOverlay() {

    if (!this.state.showingOverlay) {
      return null
    }

    const containerStyle = {
      opacity: this.state.overlayOpacity,
      padding: this.state.overlayPadding,
    }
    return (
      <Animated.View style={[StyleSheet.absoluteFill, containerStyle]}>
        {this.renderBlurView()}
        {this.tabBarOverlay}
      </Animated.View>
    )
  }

  private renderBlurView = () => {
    switch (Platform.OS) {
      case 'ios':
        return (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType='light'
            blurAmount={5}
          />
        )
      default:
        return <View style={[StyleSheet.absoluteFill, styles.backupBlur]} />
    }
  }

  private renderTabButtons = () => {
    return this.props.navigation.state.routes.map((route, index) => {
      const selected = this.props.navigationState.index === index
      return (
        <TouchableWithoutFeedback key={route.routeName} onPress={this.generateOnPress(route)}>
          <View style={styles.iconContainer}>
            {this.getIcon(route.routeName, selected)}
          </View>
        </TouchableWithoutFeedback>
      )
    })
  }

  private getIcon = (routeName: RouteName, selected: boolean) => {
    let source: string = ''
    let style

    switch (routeName) {
      case 'Profile':
        source = 'profile'
        style = styles.leftIcon
        break
      case 'Swipe':
        source = 'cards'
        style = styles.centerIcon
        break
      case 'Matches':
        source = 'chat'
        style = styles.rightIcon
    }

    source += selected ? '_blue' : '_gray'

    if (routeName === 'Matches' && this.props.shouldShowChatIndicator) {
      source += '_new'
    }

    return <Image resizeMode='contain' source={Images[source]} style={[styles.icon, style]} />
  }

  private generateOnPress = (route: NavigationRoute) => () => {
    if (!this.state.showingOverlay) {
      this.props.navigation.navigate(route.routeName)
      this.props.switchTab(route.routeName as RouteName)
    }
  }

  private renderIndicator = () => {
    const style = {
      width: INDICATOR_WIDTH,
      marginLeft: this.state.indicatorLeftMargin,
      height: INDICATOR_HEIGHT,
    }
    return (
      <Animated.View style={style}>
        <LinearGradient
          colors={['rgba(231,240,253,1)', '#B1CAEF']}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          locations={[0, 1]}
          style={{flex: 1}}
        />
      </Animated.View>
    )
  }

  private calculateIndicatorLeftMargin = (selectedTabIndex: number) => {
    const tabWidth = WIDTH / this.props.navigation.state.routes.length
    if (selectedTabIndex === this.props.navigation.state.routes.length - 1) {
      return WIDTH - INDICATOR_WIDTH
    } else if (selectedTabIndex === 0) {
      return 0
    } else {
      return tabWidth * selectedTabIndex + (tabWidth - INDICATOR_WIDTH) / 2
    }
  }

}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    tabBarOverlay: state.navigation.tabBarOverlay,
    shouldShowChatIndicator: !!state.navigation.shouldShowChatIndicator,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    switchTab: (tab: RouteName) => dispatch(switchTab(tab)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabBar)

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: 'lightgray',
        shadowRadius: 3,
        shadowOpacity: 1,
        shadowOffset: {
          height: 0,
          width: 0,
        },
      },
    }),
    ...Platform.select({
      android: {
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
      },
    }),
  },
  buttonsContainer: {
    height: Platform.select({
      ios: 40,
      android: 50,
    }),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  icon: {
    height: 25,
    width: 25,
    marginBottom: 5,
  },
  leftIcon: {
    marginLeft: 25,
    alignSelf: 'flex-start',
  },
  centerIcon: {
    height: 30,
    width: 30,
    marginBottom: 3,
    alignSelf: 'center',
  },
  rightIcon: {
    marginRight: 25,
    marginBottom: 5,
    alignSelf: 'flex-end',
  },
  backupBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
})
