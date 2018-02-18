import React, { PureComponent } from 'react'
import {
    Text,
    View,
    StyleSheet,
    } from 'react-native'

    const DEFAULT_BG_COLOR = '#FAB913';
    const DEFAULT_TIME_TXT_COLOR = '#000';
    const DEFAULT_DIGIT_TXT_COLOR = '#000';

class CountdownScreen extends PureComponent<{}, {}> {

 // componentDidMount() {
 //   // if (CountdownScreen.propTypes.onFinish) {
 //   //   this.onFinish = _.once(CountdownScreen.propTypes.onFinish);
 //   // } - uncertain what this does...
 //   this.timer = setInterval(this.updateTimer, 1000);
 // }
 //
 // componentWillUnmount() {
 //   clearInterval(this.timer);
 // }

 private renderDigit = (d: number) => {
     const digitBgColor = DEFAULT_BG_COLOR
     const digitTxtColor = DEFAULT_DIGIT_TXT_COLOR
     const size = 15
     return (
       <View style={[
         styles.digitCont,
         {backgroundColor: digitBgColor},
         {width: size * 2.3, height: size * 2.6},
       ]}>
         <Text style={[
           styles.digitTxt,
           {fontSize: size},
           {color: digitTxtColor}
         ]}>
           {d}
         </Text>
       </View>
     );
   };

   renderDoubleDigits = (label: string, digits: number) => {
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
     );
   };

   private getTimeLeft = () => {
   const until = 700;
   return {
     seconds: +until % 60,
     minutes: +until / 60 % 60,
     hours: +(+until / (60 * 60)) % 24,
     days: +(until / (60 * 60 * 24)),
   };
 };

   private renderCountDown = () => {
     // const {until} = this.state;
     const {days, hours, minutes, seconds} = this.getTimeLeft();
    // const Component = this.props.onPress ? TouchableOpacity : View;
     return (
       <View style={styles.timeCont}>
         {this.renderDoubleDigits('Days', days)}
         {this.renderDoubleDigits('Hours', hours)}
         {this.renderDoubleDigits('Minutes', minutes)}
         {this.renderDoubleDigits('Seconds', seconds)}
       </View>
     );
   };

   public render() {
     return (
       <View>
         {this.renderCountDown()}
       </View>
     );
   }

}

export default CountdownScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
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
  submitButton: {
    backgroundColor: 'lightgray',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
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
})
