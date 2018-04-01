import moment from 'moment'
import React, { PureComponent } from 'react'
import { Dimensions, Image, StyleSheet, View } from 'react-native'
import { Images } from '../../assets'
import CountDown from 'react-native-countdown-component';
import { JSText } from '../common'

interface State {
  seconds: number,
  minutes: number,
  hours: number,
  days: number,
}

const WIDTH = Dimensions.get('window').width

class CountdownScreen extends PureComponent<{}, State> {

  //private launchDay = moment([2018, 5, 13])
  private t1 = new Date();
  private t2 = new Date(2018, 4, 11, 0, 0, 0, 0);
  private launchDay = (this.t2.getTime() - this.t1.getTime())/1000;
  //private timer: number

  constructor(props: {}) {
    super(props)
    console.log(this.launchDay)
    console.log(this.t1)
    console.log(this.t2)
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
        <CountDown
          until={this.launchDay}
          digitBgColor={'#ABCCED'}
          onFinish={() => alert('finished')} //TODO: change pages/change bool here?
          size={30}
        />
          <View style={styles.titleTextContainer}>
            <JSText bold fontSize={30} style={styles.titleText}>LEFT UNTIL</JSText>
            <JSText bold fontSize={30} style={styles.titleText}>LAUNCH</JSText>
          </View>
        </View>
      </View>
    )
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
