import React, { PureComponent } from 'react'
import { Animated, Dimensions, Easing, Platform, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import { BlurView } from 'react-native-blur'
import SafeAreaView from 'react-native-safe-area-view'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {
  NavigationRoute,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation'
import { RootState } from '../../redux'
import { xor } from '../../utils'

interface OwnProps {
  navigation: NavigationScreenProp<NavigationState>
  navigationState: {
    index: number
  }
}

interface StateProps {
  tabBarOverlay?: () => JSX.Element
}

type Props = OwnProps & StateProps

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
      let icon
      switch (route.routeName) {
        case 'Profile':
          icon = (
            <Ionicons
              name={selected ? 'ios-person' : 'ios-person-outline'}
              size={35}
              style={styles.leftIcon}
              color={'rgba(147, 182, 232, 1)'}
            />
          )
          break
        case 'Swipe':
          icon = (
            <FontAwesome
              name={selected ? 'heart' : 'heart-o'}
              size={24}
              style={styles.centerIcon}
              color={'rgba(147, 182, 232, 1)'}
            />
          )
          break

        case 'Matches':
          icon = (
            <MaterialIcons
              name={selected ? 'chat-bubble' : 'chat-bubble-outline'}
              size={26}
              style={styles.rightIcon}
              color={'rgba(147, 182, 232, 1)'}
            />
          )
          break

        default:
          return null
      }

      return (
        <TouchableWithoutFeedback key={route.routeName} onPress={this.generateOnPress(route)}>
          <View style={styles.iconContainer}>
            {icon}
          </View>
        </TouchableWithoutFeedback>
      )
    })
  }

  private generateOnPress = (route: NavigationRoute) => () => {
    if (!this.state.showingOverlay) {
      this.props.navigation.navigate(route.routeName)
    }
  }

  private renderIndicator = () => {
    const style = {
      width: INDICATOR_WIDTH,
      marginLeft: this.state.indicatorLeftMargin,
      height: INDICATOR_HEIGHT,
    }
    return (
        <Animated.View style={style} >
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
  }
}

export default connect(mapStateToProps)(TabBar)

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: 'gray',
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
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  leftIcon: {
    marginLeft: 20,
    alignSelf: 'flex-start',
  },
  centerIcon: {
    alignSelf: 'center',
    marginBottom: 7,
  },
  rightIcon: {
    marginRight: 20,
    alignSelf: 'flex-end',
    marginBottom: 5,
  },
  backupBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
})
