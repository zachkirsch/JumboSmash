import React, { PureComponent } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'

class CodeofConductScreen extends PureComponent<{},{}> {

  onPressLearnMore = () => { //
  }

  public render() {
    return (
        <ScrollView>
          <View style={[styles.container, styles.center]}>
            <View style={styles.CodeofConductContainer}>
            <Text style={styles.bold}>{"\n"}{"\n"}Code of Conduct</Text>
              <Text style={styles.undertext}>{"\n"}Hello! In order to be a JumboSmash user, we ask that you agree to follow a few simple rules: {"\n"}</Text>
              <Text style={styles.Emojitext}>{"\n"}🚫🍆</Text>
              <Text style={styles.conducttext}>No nude pictures, sent, uploaded or otherwise. </Text>
              <Text style={styles.Emojitext}>{"\n"}🚫👯</Text>
              <Text style={styles.conducttext}>No identity theft: we can to boot you from the app if you sell/give your account to someone else, or pretend to be another Tufts student.</Text>
              <Text style={styles.Emojitext}>{"\n"}🚫🖕</Text>
              <Text style={styles.conducttext}>This app is for smashing, not harassing - hate speech/harassment of any kind will not be tolerated.</Text>
              <Text style={styles.Emojitext}>{"\n"}✅🙋🏽</Text>
              <Text style={styles.conducttext}>To report an individual, _________. Individuals who get reported may be booted from the app permanently.
  </Text>
              <Text style={styles.Emojitext}>{"\n"}📱❓</Text>
              <Text style={styles.conducttext}>Technical concerns or questions? Please reach us at ______.</Text>
              <Text style={styles.conducttext}>{"\n"}{"\n"}Happy smashing 💕</Text>
              <Text style={styles.conducttext}>The Jumbosmash Team 🐘 {"\n"}</Text>
            </View>


          <TouchableOpacity
            style={styles.buttoncontainer}
            onPress={this.onPressLearnMore}
          >
            <Text style={styles.buttontext}>I agree with the Code of Conduct, let’s smash</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttoncontainer}
            onPress={this.onPressLearnMore} //TODO: change this into a real function
          >
            <Text style={styles.buttontext}>I don’t treat people with respect, no thanks</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  buttontext: {
    justifyContent: 'center',
    alignItems: 'center',
    color: "#330f53",
    fontSize: 15,
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  center: {
    justifyContent: 'center'
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 30
  },
  conducttext:{
    fontSize: 19,
    color: "#3f3f3f"
  },
  Emojitext:{
    fontSize: 25
  },
  undertext:{
    fontSize: 17,
    color: '#7e7e7e'
  },
  middle: {
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 5,
    padding: 5
  },
  CodeofConductContainer: {
    alignItems: 'flex-start',
    margin: 10,
    padding: 10
  },
  buttoncontainer{
    // height:80,
    margin: 2,
    padding: 5,
    alignItems: 'center'
  },
  errorMessage: {
    color: 'red',
    fontWeight: 'bold',
  }
})

export default CodeofConductScreen
