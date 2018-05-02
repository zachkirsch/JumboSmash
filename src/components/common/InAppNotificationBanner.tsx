import React, { PureComponent } from 'react'
import { View, Animated, Platform, PanResponder, PanResponderInstance, Easing, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { isIphoneX } from '../../utils'
import { InAppNotification } from '../../services/notifications'
import JSText from './JSText'
import JSImage from './JSImage'

interface Props {
  deleteNotification: () => void
  engageNotification: () => void
  notification: InAppNotification
}

interface State {
  transateY: Animated.Value
  entered: boolean
}

const HEIGHT = 65
const TOP_BUFFER = isIphoneX() ? 20 : 0
const INITIAL_TRANSLATE_Y = -HEIGHT - TOP_BUFFER - 40

class InAppNotificationBanner extends PureComponent<Props, State> {

  private panResponder: PanResponderInstance

  constructor(props: Props) {
    super(props)
    this.state = {
      transateY: new Animated.Value(0),
      entered: false,
    }
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => this.state.entered,
      onMoveShouldSetPanResponder: () => this.state.entered,
      onPanResponderTerminationRequest: () => !this.state.entered,
      onPanResponderGrant: () => this.stopDismissTimer(),
      onPanResponderMove: (_, gestureState) => {
        this.state.transateY.setValue(
          this.finalTranslateY() + Math.min(0, gestureState.dy)
        )
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy === 0) {
          this.props.engageNotification()
        }
        this.startDismissTimer(0, this.props.deleteNotification)
      },
      onPanResponderTerminate: () => this.startDismissTimer(0, this.props.deleteNotification),
    })
  }

  componentDidMount() {
    Animated.timing(
      this.state.transateY,
      {
        toValue: this.finalTranslateY(),
        duration: 750,
        easing: Easing.inOut(Easing.cubic),
        delay: 2000,
      }
    ).start(() => {
      this.setState({
        entered: true,
      })
      this.startDismissTimer()
    })
  }

  render() {
    const style = [
      styles.outerContainer,
      {
        transform: [{ translateY: this.state.transateY }],
      },
    ]

    return (
      <Animated.View {...this.panResponder.panHandlers} style={style}>
        <LinearGradient
          colors={['rgb(242, 195, 188)', 'rgba(230, 165, 165, 0.8)']}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 1}}
          locations={[0, 1]}
          style={styles.gradient}
        >
          <View style={styles.innerContainer}>
            <JSImage
              cache
              source={{uri: this.props.notification.imageUri}}
              style={styles.image}
            />
            <View style={styles.textContainer}>
              <JSText bold style={styles.title}>{this.props.notification.title}</JSText>
              <JSText numberOfLines={1}>{this.props.notification.subtitle}</JSText>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    )
  }

  private startDismissTimer = (delay = 3000, onComplete?: () => void) => {
    Animated.timing(
      this.state.transateY,
      {
        toValue: 0,
        duration: 350,
        delay,
        easing: Easing.inOut(Easing.cubic),
      }
    ).start(onComplete)
  }

  private stopDismissTimer = () => {
    this.state.transateY.stopAnimation()
  }

  private finalTranslateY = () => -INITIAL_TRANSLATE_Y
}

export default InAppNotificationBanner

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: INITIAL_TRANSLATE_Y,
    height: HEIGHT + TOP_BUFFER,
  },
  innerContainer: {
    width: '100%',
    height: HEIGHT - Platform.select({
      ios: 15,
      android: 0,
    }),
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 5,
  },
  title: {
    fontSize: 15,
  },
})