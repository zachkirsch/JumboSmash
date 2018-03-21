import React, { PureComponent } from 'react'
import { Animated, Dimensions, Easing, Platform, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import SafeAreaView from 'react-native-safe-area-view'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {
  NavigationRoute,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation'

interface Props {
  navigation: NavigationScreenProp<NavigationState>
  navigationState: {
    routes: any[] /* tslint:disable-line:no-any */
    index: number
    isTransitioning: boolean
    routeName: string
    key: string
  }
}

interface State {
  indicatorLeftMargin: Animated.Value
}

const WIDTH = Dimensions.get('window').width

const INDICATOR_WIDTH = WIDTH / 5
const INDICATOR_HEIGHT = 3

class TabBar extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      indicatorLeftMargin: new Animated.Value(this.calculateIndicatorLeftMargin(props.navigationState.index)),
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
      </SafeAreaView>
    )
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
          return null /* tslint:disable-line:no-null-keyword */
      }

      return (
        <TouchableWithoutFeedback key={route.routeName} onPress={this.generateOnPress(route, index)}>
          <View style={styles.iconContainer}>
            {icon}
          </View>
        </TouchableWithoutFeedback>
      )
    })
  }

  private generateOnPress = (route: NavigationRoute, index: number) => {
    return () => {
      Animated.timing(
        this.state.indicatorLeftMargin,
        {
          toValue: this.calculateIndicatorLeftMargin(index),
          easing: Easing.elastic(1.3),
        }
      ).start()
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
          colors={['rgba(231,240,253,1)', '#B1CAEF', 'rgba(231,240,253,1)']}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          locations={[0, 0.5, 1]}
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

export default TabBar

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
      android: 45,
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
})
