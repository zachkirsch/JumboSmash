import React, { PureComponent } from 'react'
import {
    Text,
    View,
    Image,
    StyleSheet,
    } from 'react-native'
import { Images } from '../../assets'

    const DEFAULT_BG_COLOR = '#ABCCED'
    const DEFAULT_TIME_TXT_COLOR = '#000'
    const DEFAULT_DIGIT_TXT_COLOR = '#FFF'

interface State {
      sec: number,
      min: number,
      hr: number,
      days: number,
}

class CountdownScreen extends PureComponent<{}, State> {

 private CountDownClock: number

 constructor(props: {}) {
   super(props)
   const {days, hours, minutes, seconds} = this.getTimeLeft()
   this.state = {
      days: days,
      hr: hours,
      min: minutes,
      sec: seconds,
   }
 }

 public componentDidMount() {
   if ((this.state.days + this.state.hr + this.state.min + this.state.sec) > 0){
     this.CountDownClock = setInterval(() => {
       const {days, hours, minutes, seconds} = this.getTimeLeft()
       this.setState({
          days: days,
          hr: hours,
          min: minutes,
          sec: seconds,
       })
     }, 1000)
   }
 }

 public render() {

   return (
     <View style={styles.Centercontainer}>
     <View style={styles.Centercontainer}>
     </View>
         <View style={styles.logoContainer}>
           <Image
             source={Images.jumbo2018}
             style={styles.logo}
           />
         </View>

          <View>
            {this.renderCountDown()}
          </View>
            <View style={styles.Centercontainer}>
          <View style={styles.doubleDigitCont}>
          <Text style={styles.TitleText}>LEFT UNTIL</Text>
        <Text style={styles.TitleText}>LAUNCH</Text>
          </View>
          </View>
          <View style={styles.Centercontainer}></View>
     </View>

   )
 }
 private renderDigit = (d: number) => {
     const digitBgColor = DEFAULT_BG_COLOR
     const digitTxtColor = DEFAULT_DIGIT_TXT_COLOR
     const size = 30
     return (
       <View style={[
         styles.digitCont,
         {backgroundColor: digitBgColor},
         {width: size * 2.3, height: size * 2.6},
       ]}>
         <Text style={[
           styles.digitTxt,
           {fontSize: size},
           {color: digitTxtColor},
         ]}>
           {d}
         </Text>
       </View>
     )
   }

   private renderDoubleDigits = (label: string, digits: number) => {
     const timeTxtColor = DEFAULT_TIME_TXT_COLOR
     const size = 15
     return (
       <View key={label} style={styles.doubleDigitCont}>
         <View style={styles.timeInnerCont}>
           {this.renderDigit(digits)}
         </View>
         <Text style={[
           styles.timeTxt,
           {fontSize: size / 1.8},
           {color: timeTxtColor},
         ]}>
           {label}
         </Text>
       </View>
     )
   }
//TODO: CHECK THIS MATH OMG OR FIX IT TO SOMETHING NOT HACKED TOGETHER.
   private getTimeLeft = () => {
   const now: Date = new Date()
   const release: Date = new Date(2018, 5, 11, 22, 30, 0)
   let seconds = (release.getSeconds() - now.getSeconds())
   let minutes = (release.getMinutes() - now.getMinutes())
   let hours = (release.getHours() - now.getHours())
   let days = 0
   let currentMonth = now.getMonth()
   for (var i = currentMonth; i < release.getMonth(); i++){
     if (i == 2) { days = days + 28}
     if (i == 3) { days = days + 31}
     if (i == 4) { days = days + 30}
     if (i == 5) { days = days + 11}
   }
   days = days - now.getDate() + release.getDate()

   //const hours = (release.)
   if (seconds < 0){
    seconds = (60 + seconds)
    minutes = minutes - 1
   }
   if (minutes < 0){
     minutes = (60 + minutes)
     hours = hours - 1
   } if (hours < 0){
     hours = 24 + hours
     days = days - 1
   }

   return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
   }
 }

   private renderCountDown = () => {
     return (
         <View style={styles.timeCont}>
           {this.renderDoubleDigits('Days', this.state.days)}
           {this.renderDoubleDigits('Hours', this.state.hr)}
           {this.renderDoubleDigits('Minutes', this.state.min)}
           {this.renderDoubleDigits('Seconds', this.state.sec)}
         </View>
     )
   }

}

export default CountdownScreen

const styles = StyleSheet.create({
  Centercontainer: {
     flexDirection: 'column',
     justifyContent: 'center',
     flex: 2,
  },
  logoContainer: {
    flex: 3,
    justifyContent: 'flex-end',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  errorMessageContainer: {
    alignItems: 'center',
  },
  errorMessage: {
    color: 'red',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'lightgray',
    borderWidth: 1,
    marginVertical: 5,
    marginHorizontal: 40,
    padding: 5,
    borderRadius: 5,
  },
  submitContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  submitButtonText: {
    fontSize: 20,
  },
  timeCont: {
   flexDirection: 'row',
   justifyContent: 'center',
 },
 timeTxt: {
   color: 'white',
   marginVertical: 2,
   backgroundColor: 'transparent',
 },
 timeInnerCont: {
   flexDirection: 'row',
   justifyContent: 'center',
   alignItems: 'center',
 },
 digitCont: {
   borderRadius: 5,
   marginHorizontal: 2,
   alignItems: 'center',
   justifyContent: 'center',
 },
 doubleDigitCont: {
   justifyContent: 'center',
   alignItems: 'center',
 },
 digitTxt: {
   color: 'white',
   fontWeight: 'bold',
 },
 logo: {
   flex: 1,
   width: undefined,
   height: undefined,
   resizeMode: 'contain',
   marginBottom: 40,
 },
 TitleText: {
   fontWeight: 'bold',
   fontSize: 40,
   marginTop: 0,
   color: '#ABCCED',

 },
})
