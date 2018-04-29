import moment from 'moment'
import React, { PureComponent } from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../redux'
import { getServerTime } from '../../services/time'
import LinearGradient from 'react-native-linear-gradient'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { Images } from '../../assets'
import { JSText, JSImage } from '../common'
import { LoadableValue } from '../../services/redux'
import { LoginRoute } from '../navigation'

interface StateProps {
  releaseDate: number
  postRelease: boolean
  serverTime: LoadableValue<number | undefined>
}

interface DispatchProps {
  getServerTime: () => void
}

interface State {
  seconds: number
  minutes: number
  hours: number
  days: number
  totalSecondsRemaining: number
}

type Props = NavigationScreenPropsWithRedux<{}, StateProps & DispatchProps>

class CountdownScreen extends PureComponent<Props, State> {

  private timer: number
  private screenIsMounted: boolean

  constructor(props: Props) {
    super(props)
    this.state = {
      ...this.getTimeLeft(),
    }
  }

  public componentDidMount() {
    this.screenIsMounted = true
    this.props.getServerTime()
    this.timer = setInterval(() => {
      const timeLeft = this.getTimeLeft()
      if (timeLeft.totalSecondsRemaining <= 0 && this.props.serverTime.value) {
        if (!this.props.serverTime.loading) {
          this.props.getServerTime()
        }
      }
      this.screenIsMounted && this.setState(timeLeft)
    }, 1000)
  }

  public componentWillUnmount() {
    this.screenIsMounted = false
    clearInterval(this.timer)
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.postRelease) {
      clearInterval(this.timer)
      this.props.navigation.navigate(LoginRoute.LoginScreen)
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
        <View style={styles.logoContainer}>
          <JSImage
            cache={false}
            source={Images.jumbo2018}
            style={styles.logo}
            resizeMode={'contain'}
          />
        </View>
        <View style={styles.bottomContainer}>
          {this.renderCountdown()}
          <View style={styles.titleTextContainer}>
            <SimpleLineIcons
              name='rocket'
              size={60}
              color='rgb(162, 191, 227)'
              style={styles.rocket}
            />
            <JSText semibold style={styles.titleText}>COMING SOON</JSText>
          </View>
        </View>
        {this.renderServerTimeMessage()}
      </View>
    )
  }

  private renderServerTimeMessage = () => {
    return (
      <View>
        <ActivityIndicator animating={this.props.serverTime.loading} />
        <JSText semibold style={styles.serverTimeText}>
          {this.props.serverTime.loading ? 'Checking Server Time...' : ''}
        </JSText>
      </View>
    )
  }

  private renderCountdown = () => {
    return (
      <View style={styles.countdown}>
        {this.renderUnit('Days', this.state.days)}
        {this.renderColon()}
        {this.renderUnit('Hours', this.state.hours)}
        {this.renderColon()}
        {this.renderUnit('Minutes', this.state.minutes)}
        {this.renderColon()}
        {this.renderUnit('Seconds', this.state.seconds)}
      </View>
    )
  }

  private renderUnit = (label: string, value: number) => {

    const valueStr = value >= 10 ? value.toString() : '0' + value.toString()

    return (
      <View style={[styles.center, styles.countdownUnit]}>
        <JSText style={[styles.chalkText, styles.countdownUnitText]}>{valueStr}</JSText>
        <JSText style={styles.countdownUnitLabel}>{label}</JSText>
      </View>
    )
  }

  private renderColon = () => (
    <JSText style={[styles.chalkText, styles.colon]}>:</JSText>
  )

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
  },
  countdown: {
    flexDirection: 'row',
    marginHorizontal: '5%',
  },
  chalkText: {
    fontFamily: 'Chalkduster',
    fontSize: 30,
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
    fontSize: 10,
    letterSpacing: 3.1,
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
  titleTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 20,
    marginBottom: 40,
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
})
