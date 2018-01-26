import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal, Button} from 'react-native'
import {default as LogoutMenu} from './LogoutMenu'


interface State {
  tasks: [{id: number, name: string}],
  isLoggingOut: boolean,
  isReporting: boolean
}
//TODO: settingsMenu freezes for some reason
//TODO: logout does nothing
//TODO:
class SettingsMenuScreen extends PureComponent<{}, State> {

  constructor(props: {}){
    super(props);
    this.state = {tasks: [{
                             id: 0,
                             name: 'Tags',
                          },{
                             id: 1,
                             name: 'Code of Conduct',
                          },
                          {
                             id: 2,
                             name: 'Reporting',
                          },
                          {
                             id: 3,
                             name: 'Logout',
                          }]
                  ,
                  isLoggingOut: false,
                  isReporting: false
                }
  }


  public render() {
    return (

         <View style={[styles.container]}>
         <View style={{flex:3}}/>
         {
            this.state.tasks.map((item) => (
               <TouchableOpacity
                  key = {item.id}
                  style = {styles.center}
                  onPress = {() => this.onPressedMenu(item.name)}>
                  <Text style = {styles.text}>
                     {item.name}
                  </Text>
               </TouchableOpacity>
            ))
         }
         <View style={{flex:3}}/>
         {this.state.isLoggingOut && this.renderLogOut()}
         {this.state.isReporting && this.renderReporting()}
      </View>
    )
  }

  private renderReporting = () =>{
    return <Modal>

            <View style={[styles.modal, styles.center, styles.signoff]}>
            <Text style={styles.titleText}>To Report Something or Someone...</Text>
            <Text></Text>
            <View style={[styles.left, styles.signoffLeft]}>
                <Text style={styles.SignOfftext}>[1] 🤔 Make sure that the action or individual actually violates our code of conduct. </Text>
                <Text></Text>
                <Text style={styles.SignOfftext}>[2] 📸 Take a screenshot of the issue. </Text>
                <Text></Text>
                <Text style={styles.SignOfftext}>[3] ✉️ Please email [INSERT JUMBOSMASH EMAIL HERE] with the title "REPORTING". Include the screenshot, and which article of the Code of Conduct the individual or action is violating. </Text>
                <Text></Text>
                <Text style={styles.SignOfftext}>[4] ✅ Our team will resolve the issue in 24 hours! </Text>
                {this.renderSignoff()}
              <Button
                onPress = {() => this.setState({ isReporting: false })}
                title="Okay, thanks"
                color="#841584"
                accessibilityLabel="Okay, thanks"
              />
              </View>
            </View>
            </Modal>
  }
  private renderSignoff = () => {
    return (
      <View style={styles.signoff}>
        <Text style={styles.text}>xoxo 💕</Text>
        <Text style={styles.text}>The Jumbosmash Team 🐘</Text>
      </View>
    )
  }

  private renderLogOut(){
    return <Modal>
    < LogoutMenu />
    <Button
      onPress = {() => this.setState({ isLoggingOut: false })}
      title="No"
      color="#841584"
      accessibilityLabel="No"
    />
    <View style={{flex:3}}/>
    </Modal>
  }
  private onPressedMenu(name: string){
    if (name == 'Logout'){
      this.setState({ isLoggingOut: true });
    } else if (name == "Reporting") {
      this.setState({ isReporting: true});}
    // } else if (name == "Code Of Conduct") {
    //   
    // }

  }
}

export default SettingsMenuScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    flexDirection: 'column',
    borderBottomColor: '#D3D3D3',
    borderBottomWidth: 1,
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
      fontWeight: 'bold',
      fontFamily: 'Helvetica',
      color: '#595959',
    },
    titleText:{
      marginTop: 3,
      fontSize: 24,
      fontWeight: 'bold',
      fontFamily: 'Helvetica',
      color: '#3f3f3f',
      alignItems: 'center',
    }
})
