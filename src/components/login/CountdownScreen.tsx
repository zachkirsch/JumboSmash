import moment from 'moment'
import React, { PureComponent } from 'react'
import { Dimensions, Image, StyleSheet, View } from 'react-native'
import { Images } from '../../assets'
import { JSText } from '../common'

interface State {
  seconds: number,
  minutes: number,
  hours: number,
  days: number,
}

const WIDTH = Dimensions.get('window').width

class CountdownScreen extends PureComponent<{}, State> {

  private launchDay = moment([2018, 5, 13])
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
        <Image
          source={Images.jumbo2018}
          style={styles.logo}
          resizeMode={'contain'}
        />
        <View style={styles.bottomContainer}>
          {this.renderCountdown()}
          <View style={styles.titleTextContainer}>
            <JSText bold fontSize={40} style={styles.titleText}>LEFT UNTIL</JSText>
            <JSText bold fontSize={40} style={styles.titleText}>LAUNCH</JSText>
          </View>
        </View>
      </View>
    )
  }

  private renderCountdown = () => {
    return (
      <View style={styles.countdown}>
        {this.renderUnit('Days', this.state.days)}
        {this.renderUnit('Hours', this.state.hours)}
        {this.renderUnit('Minutes', this.state.minutes)}
        {this.renderUnit('Seconds', this.state.seconds)}
      </View>
    )
  }

  private renderUnit = (label: string, value: number) => {
    return (
      <View style={styles.center}>
        <View style={[styles.center, styles.countdownUnit]}>
          <JSText fontSize={30} style={styles.countdownUnitText}>{value}</JSText>
        </View>
        <JSText>{label}</JSText>
      </View>
    )
  }

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
    justifyContent: 'center',
  },
  countdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  countdownUnit: {
    width: WIDTH / 6,
    height: WIDTH / 5,
    borderRadius: 10,
    backgroundColor: '#ABCCED',
  },
  countdownUnitText: {
    color: 'white',
  },
  logo: {
    margin: 30,
    flex: 1,
    width: undefined,
    height: undefined,
  },
  titleTextContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 20,
  },
  titleText: {
    color: '#ABCCED',
  },
})
