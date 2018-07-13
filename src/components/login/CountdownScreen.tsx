import moment from 'moment'
import React, { PureComponent } from 'react'
import { Animated, Image, Easing, TouchableOpacity, StyleSheet, View, ActivityIndicator, Dimensions } from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../redux'
import { getServerTime, markCountdownAsSeen } from '../../services/time'
import LinearGradient from 'react-native-linear-gradient'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { Images } from '../../assets'
import { JSText } from '../common'
import { LoadableValue } from '../../services/redux'
import { LoginRoute } from '../navigation'

interface StateProps {
  releaseDate: number
  postRelease: boolean
  serverTime: LoadableValue<number | undefined>
}

interface DispatchProps {
  getServerTime: () => void
  markCountdownAsSeen: () => void
}

interface State {
  seconds: number
  minutes: number
  hours: number
  days: number
  totalSecondsRemaining: number
  rocket: {
    animating: boolean
    alreadyAnimated: boolean
    rotation: Animated.Value
    translateY: Animated.Value
  }
}

type Props = NavigationScreenPropsWithRedux<{}, StateProps & DispatchProps>

const HEIGHT = Dimensions.get('window').height

class CountdownScreen extends PureComponent<Props, State> {

  private timer?: number // for counting seconds down
  private navigateTimer: number
  private screenIsMounted: boolean

  constructor(props: Props) {
    super(props)
    this.state = this.getInitialState()
  }

  public componentDidMount() {
    this.screenIsMounted = true
    this.timer = setInterval(this.updateCountdown, 1000)
  }

  public componentWillUnmount() {
    this.screenIsMounted = false
    this.timer && clearInterval(this.timer)
    clearTimeout(this.navigateTimer)
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.postRelease) {
      this.timer && clearInterval(this.timer)
      this.navigateWhenReady()
    } else if (nextProps.serverTime.value && nextProps.serverTime.value > 0) {
      if (this.props.serverTime.value && this.props.serverTime.value <= 0) {
        // they tried to cheat
        if (this.state.rocket.animating || this.state.rocket.alreadyAnimated) {
          this.state.rocket.rotation.stopAnimation()
          this.setState(this.getInitialState())
        }
        if (!this.timer) {
          this.timer = setInterval(this.updateCountdown, 1000)
        }
      }
    }
  }

  public render() {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['rgb(201, 218, 243)', 'rgba(255, 255, 255, 0)']}
          start={{x: 0, y: 1}}
          end={{x: 0, y: 0.5}}
          style={StyleSheet.absoluteFill}
        />
        {this.renderLogo()}
        <View style={styles.bottomContainer}>
          {this.renderCountdown()}
        </View>
        <View style={styles.overlay}>
          {this.renderOverlayContents()}
        </View>
        <View style={styles.rocketContainer}>
          {this.renderRocket()}
          {this.renderBottomText()}
        </View>
      </View>
    )
  }

  private renderLogo = () => {
    return (
      <View style={styles.logoContainer}>
        <Image
          source={Images.jumbo2018}
          style={styles.logo}
          resizeMode={'contain'}
        />
      </View>
    )
  }

  private renderBottomText = () => {
    let text = ''
    if (this.state.totalSecondsRemaining <= 0 || this.props.postRelease) {
      text = 'PREPARING FOR LAUNCH'
    } else if (!this.props.serverTime.errorMessage) {
      text = 'COMING SOON'
    }
    return (
      <View>
        <JSText semibold style={styles.titleText}>{text}</JSText>
      </View>
    )
  }

  private renderRocket = () => {

    /* tslint:disable-next-line:no-any */
    const style: any[] = [styles.rocket]
    if (this.state.totalSecondsRemaining <= 0) {
      style.push({
        transform: [
          {
            rotate: this.state.rocket.rotation.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '-45deg'],
            }),
          },
          {
            translateY: this.state.rocket.translateY.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -HEIGHT * 2 / 3],
            }),
          },
          {
            translateX: this.state.rocket.translateY.interpolate({
              inputRange: [0, 1],
              outputRange: [0, HEIGHT * 2 / 3],
            }),
          },
        ],
      })
    }

    return (
      <Animated.View style={style}>
        <SimpleLineIcons
          name='rocket'
          size={60}
          color='rgb(162, 191, 227)'
        />
      </Animated.View>
    )
  }

  private renderCountdown = () => {
    if (this.state.totalSecondsRemaining === 0) {
      return null
    }
    const style = [
      styles.countdown,
      {
        opacity: this.state.rocket.rotation.interpolate({
          inputRange: [0, 0.05],
          outputRange: [1, 0],
        }),
      },
    ]

    return (
      <Animated.View style={style}>
        {this.renderUnit('DAYS', this.state.days)}
        {this.renderColon()}
        {this.renderUnit('HOURS', this.state.hours)}
        {this.renderColon()}
        {this.renderUnit('MINUTES', this.state.minutes)}
        {this.renderColon()}
        {this.renderUnit('SECONDS', this.state.seconds)}
      </Animated.View>
    )
  }

  private renderUnit = (label: string, value: number) => {
    const valueStr = value >= 10 ? value.toString() : '0' + value.toString()
    return (
      <View style={[styles.center, styles.countdownUnit]}>
        <JSText style={[styles.chalkText, styles.countdownUnitText]}>
          {valueStr}
        </JSText>
        <JSText style={styles.countdownUnitLabel}>{label}</JSText>
      </View>
    )
  }

  private renderColon = () => (
    <JSText style={[styles.chalkText, styles.colon]}>:</JSText>
  )

  private renderOverlayContents = () => {
    if (this.state.rocket.alreadyAnimated && this.props.serverTime.loading && this.state.totalSecondsRemaining <= 0) {
      return <ActivityIndicator />
    }
    if (this.props.serverTime.errorMessage) {
      return (
        <TouchableOpacity onPress={this.props.getServerTime} >
          <JSText bold style={styles.retry}>Couldn't connect to the server.</JSText>
          <JSText bold style={styles.retry}>Tap to retry.</JSText>
        </TouchableOpacity>
      )
    }
    return null
  }

  private getTimeLeft = () => {
    const now = moment((this.props.serverTime.value || 0) + Date.now() - (this.props.serverTime.lastFetched || 0))
    const diff = moment.duration(moment(this.props.releaseDate).diff(now))
    return {
      seconds: Math.max(0, diff.seconds()),
      minutes: Math.max(0, diff.minutes()),
      hours: Math.max(0, diff.hours()),
      days: Math.max(0, moment(this.props.releaseDate).diff(now, 'days')),
      totalSecondsRemaining: diff.asSeconds(),
    }
  }

  private updateCountdown = () => {
    const timeLeft = this.getTimeLeft()
    if (timeLeft.totalSecondsRemaining <= 0) {
      this.timer && clearInterval(this.timer)
      this.timer = undefined
      if (!this.props.serverTime.loading) {
        this.props.getServerTime()
      }
      if (!this.state.rocket.animating && !this.state.rocket.alreadyAnimated) {
        this.setState({
          rocket: {
            ...this.state.rocket,
            animating: true,
          },
        }, () => {
          const rotation = Animated.timing(
            this.state.rocket.rotation,
            {
              toValue: 1,
              duration: 5000,
            }
          )
          const translation = Animated.timing(
            this.state.rocket.translateY,
            {
              toValue: 1,
              duration: 1000,
              easing: Easing.exp,
            }
          )
          Animated.sequence([rotation, translation]).start(() => {
            this.setState({
              rocket: {
                ...this.state.rocket,
                alreadyAnimated: true,
                animating: false,
              },
            })
          })
        })
      }
    }
    this.screenIsMounted && this.setState(timeLeft)
  }

  private navigateWhenReady = () => {
    if (!this.state.rocket.alreadyAnimated) {
      this.navigateTimer = setTimeout(this.navigateWhenReady, 1000)
    } else {
      this.props.markCountdownAsSeen()
      this.props.navigation.navigate(LoginRoute.LoginScreen)
    }
  }

  private getInitialState = (): State => ({
    ...this.getTimeLeft(),
    rocket: {
      animating: false,
      alreadyAnimated: false,
      rotation: new Animated.Value(0),
      translateY: new Animated.Value(0),
    },
  })
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    postRelease: state.time.postRelease,
    releaseDate: state.time.releaseDate,
    serverTime: state.time.serverTime,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    getServerTime: () => dispatch(getServerTime()),
    markCountdownAsSeen: () => dispatch(markCountdownAsSeen()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CountdownScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'space-around',
    marginBottom: 60,
  },
  countdown: {
    flexDirection: 'row',
    marginHorizontal: '5%',
  },
  chalkText: {
    fontFamily: 'Chalkduster',
    fontSize: 28,
    color: '#738CB0',
  },
  colon: {
    flex: 0,
    flexGrow: 0,
  },
  countdownUnit: {
    flex: 1,
    flexGrow: 1,
  },
  countdownUnitText: {
    letterSpacing: 5,
  },
  countdownUnitLabel: {
    fontSize: 9,
    letterSpacing: 2.5,
  },
  logoContainer: {
    marginTop: 30,
    marginHorizontal: '15%',
    flex: 1,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  rocketContainer: {
    ...StyleSheet.absoluteFillObject,
    bottom: 40,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  titleText: {
    color: '#738CB0',
    letterSpacing: 3.2,
    fontSize: 15,
  },
  serverTimeText: {
    color: '#738CB0',
    letterSpacing: 1,
    fontSize: 12,
    marginBottom: 15,
    marginTop: 8,
    textAlign: 'center',
  },
  rocket: {
    marginBottom: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  retry: {
    textAlign: 'center',
    color: '#A82A2A',
    fontSize: 16,
  },
})
