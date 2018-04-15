import moment from 'moment'
import React, { PureComponent } from 'react'
import { StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { Images } from '../../assets'
import { JSText, JSImage } from '../common'

interface State {
  seconds: number,
  minutes: number,
  hours: number,
  days: number,
}

class CountdownScreen extends PureComponent<{}, State> {

  private launchDay = moment([2018, 4, 13]) // Month is 0-based
  private timer: number

  constructor(props: {}) {
    super(props)
    this.state = this.getTimeLeft()
  }

  public componentDidMount() {
    this.timer = setInterval(() => {
      this.setState(this.getTimeLeft())
    }, 1000)
  }

  public componentWillUnmount() {
    clearInterval(this.timer)
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
        <JSImage
          source={Images.jumbo2018}
          style={styles.logo}
          resizeMode={'contain'}
        />
        <View style={styles.bottomContainer}>
          {this.renderCountdown()}
          <View style={styles.titleTextContainer}>
            <SimpleLineIcons
              name='rocket'
              size={60}
              color='rgb(162, 191, 227)'
              style={styles.rocket}
            />
            <JSText semibold fontSize={15} style={styles.titleText}>COMING SOON</JSText>
          </View>
        </View>
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
        <JSText fontSize={30} style={styles.countdownUnitText}>{valueStr}</JSText>
        <JSText fontSize={10} style={styles.countdownUnitLabel}>{label}</JSText>
      </View>
    )
  }

  private renderColon = () => (
    <JSText fontSize={30} style={styles.colon}>:</JSText>
  )

  private getTimeLeft = (): State => {
    const now = moment()
    const diff = moment.duration(this.launchDay.diff(now))
    return {
      seconds: Math.max(0, diff.seconds()),
      minutes: Math.max(0, diff.minutes()),
      hours: Math.max(0, diff.hours()),
      days: Math.max(0, this.launchDay.diff(now, 'days')),
    }
  }
}

export default CountdownScreen

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
  colon: {
    fontFamily: 'Chalkduster',
    color: '#738CB0',
    flex: 0,
    flexGrow: 0,
  },
  countdownUnit: {
    flex: 1,
    flexGrow: 1,
  },
  countdownUnitText: {
    fontFamily: 'Chalkduster',
    color: '#738CB0',
    letterSpacing: 5,
  },
  countdownUnitLabel: {
    letterSpacing: 3.1,
  },
  logo: {
    marginTop: 30,
    marginHorizontal: '15%',
    flex: 1,
    width: undefined,
    height: undefined,
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
  },
  rocket: {
    marginBottom: 15,
  },
})
