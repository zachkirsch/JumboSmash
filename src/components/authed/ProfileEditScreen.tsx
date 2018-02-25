import React, { PureComponent } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native'

class ProfileEditScreen extends PureComponent<{}, {}> {

  public render() {
    return (
      <ScrollView>
        <View style={styles.Centercontainer}>
        <View style={{flex: 4, flexDirection: 'row', justifyContent:'space-around'}}>
        <View style={{flex: 1, flexDirection: 'column', justifyContent:'space-around'}}>
          <View style={{width: 210, height: 210, backgroundColor: 'red', padding: 80}} />
        </View>
        <View style={{flex: 1, flexDirection: 'column', justifyContent:'flex-end'}}>
        <View style={{flex: 1, flexDirection: 'column', justifyContent:'space-around'}}>
          <View style={{width: 80, height: 80, backgroundColor: 'steelblue'}} />
          <View style={{width: 80, height: 80, backgroundColor: 'skyblue'}} />
          <View style={{width: 80, height: 80, backgroundColor: 'powderblue'}} />
        </View>
        </View>
        </View>
        <View style={{flex: 3, flexDirection: 'row', justifyContent:'space-around', alignSelf: 'flex-start'}}>
          <View style={{width: 80, height: 80, backgroundColor: 'powderblue'}} />
          <View style={{width: 80, height: 80, backgroundColor: 'skyblue'}} />
          <View style={{width: 80, height: 80, backgroundColor: 'steelblue'}} />
        </View>
        </View>
      </ScrollView>
    )
  }
}

export default ProfileEditScreen

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
