import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, ScrollView} from 'react-native'
import {emailSupport} from '../utils'
import { NavigationScreenProps } from 'react-navigation'
import { JSButton, JSText } from '../generic/index';

type Props = NavigationScreenProps<{}>

class ReportScreen extends PureComponent<Props, {}> {
  constructor(props: Props){
    super(props)
  }
  render(){
    return(
      <ScrollView><View style={[styles.center, styles.signoff]}>
                  <JSText fontSize={20} style={styles.title}>To Report Something or Someone...</Text>
                  <Text></Text>
                  <View style={[styles.left, styles.signoffLeft]}>
                      <JSText style={styles.SignOfftext}>[1] 🤔 Make sure that the action or individual actually violates our code of conduct. </JSText>
                      <Text></Text>
                      <JSText style={styles.SignOfftext}>[2] 📸 Take a screenshot of the issue. </JSText>
                      <Text></Text>
                      <JSText style={styles.SignOfftext}>[3] ✉️ Please email [INSERT JUMBOSMASH EMAIL HERE] with the title "REPORTING". Include the screenshot, and which article of the Code of Conduct the individual or action is violating. </JSText>
                      <Text></Text>
                      <JSText style={styles.SignOfftext}>[4] ✅ Our team will resolve the issue in 24 hours! </JSText>
                      {this.renderSignoff()}
                    </View>
                    <View style={styles.buttons}>
                    <JSButton
                      onPress = {() => emailSupport("FEEDBACK/REPORTING")}
                      label="Report Something"
                      accessibilityLabel="Report"
                    ></JSButton>
                    <View></View>
                        <JSButton
                          onPress = {() => this.props.navigation.goBack()}
                          label="Go Back"
                          accessibilityLabel="Go Back"
                        ></JSButton></View>
                    </View></ScrollView>)
  }
  private renderSignoff = () => {
   return (
     <View style={styles.signoff}>
       <JSText style={styles.text}>xoxo 💕</JSText>
       <JSText style={styles.text}>The Jumbosmash Team 🐘</JSText>
     </View>
   )
 }
}

  export default ReportScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    padding: 1
  },
  left: {
    flex: 1,
    flexDirection: 'column',
    borderBottomColor: '#D3D3D3',
    borderBottomWidth: 1,
    alignItems: 'center',
    padding: 1
  },
  modal: {
    alignItems: 'center',
    padding: 5
  },
  SignOfftext: {
    fontSize: 19,
    color: '#3f3f3f',
    alignSelf: 'flex-start'
  },
  signoff: {
    marginTop: 30
  },
  signoffLeft: {
    margin: 20,
    alignSelf: 'flex-start',
    justifyContent: 'flex-start'
  },
    text:{
      fontSize: 22,
      color: '#595959',
    },
    titleText:{
      marginTop: 3,
      alignItems: 'center',
    },
     buttons:{
        flex: 1,
        justifyContent: 'space-around',
        paddingVertical: 5,
      },
})
