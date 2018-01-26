import React, { PureComponent } from 'react'
import { Modal, View, Text, TextInput, Button, StyleSheet, Alert /*Image, CameraRoll*/} from 'react-native'
import { NavigationTabScreenOptions } from 'react-navigation'
import { Icon } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {default as SettingsMenuScreen} from './SettingsMenu'


//TODO: , CAMERA ROLL, BACKEND PERSISTENCE, ADDITIONAL FEATURES (TAGS, etc?)
//Bugs: 1) this isn't actually sanitizing input before changing it in state...? Fix with backend persistence?
/*       2) Image part of react-native not working, static links or uri's*/
interface State {
  bio: string,
  avatarSource: string,
  name: string,
  age: number,
  modalVisible: boolean,
  nameEditing: boolean,
  bioEditing: boolean,
}

const ALPHA_REGEX = /^[A-Za-z -']+$/

class ProfileScreen extends PureComponent<{}, State> {

  constructor(props: {}) {
     super(props);
     this.state = { bio: "I haven't set up a bio yet." +'\n' +"I have 240 characters to do so!",
                    avatarSource: 'none',
                    name: 'Dummy Name',
                    age: 21,
                    modalVisible: false,
                    nameEditing: false,
                    bioEditing: false
                  };
   }

  static navigationOptions: NavigationTabScreenOptions = {
    tabBarIcon: ({focused, tintColor}) => (
      <Ionicons
        name={focused ? 'ios-person' : 'ios-person-outline'}
        size={35}
        style={{ color: tintColor }}
      />
    ),
  }

  render() {
    return (
      <View style={{flex: 1, marginTop: 8, flexDirection: 'column', backgroundColor: '#EFEFEF'}}>
            {this.renderTopBar() //TODO: for some reason the top bar isn't working
            }
            {this.renderProfilePictures()}
            {this.renderNameSection()}
            {this.renderBioSection()}
            {this.renderLogoutSection()}
            {this.renderModal()}
      </View>
    )
  }

/*********************** HELPER FUNCTIONS FOR RENDERING ***********************/
  private renderNameSection = () => {
    if (this.state.nameEditing) {
      return this.renderNameEdit()
    }
    else {
      return this.renderName()
    }
  }

  private renderModal = () => {
    return <Modal animationType = {"slide"} transparent = {false} visible = {this.state.modalVisible}>
        <SettingsMenuScreen />
        <Button
          onPress = {() => {this.toggleModal(false)}}
          title="Back to Profile"
          color="#841584"
          accessibilityLabel="Back to Profile"
        />
      </Modal>
  }

  private toggleModal(visible: boolean) {
     this.setState({ modalVisible: visible });
  }

  private toggleNameEdit(visible: boolean) {
       this.setState({ nameEditing: visible });
  }

  private toggleBioEdit(visible: boolean) {
       this.setState({ bioEditing: visible });
  }

  private renderBioSection = () => {
    if (this.state.bioEditing){
      return <View style={{flex: 4, flexDirection: 'row'}} >
          <View style={{flex: 4, flexDirection: 'column'}}>
              <Text style={styles.typeText}></Text>
              {this.renderBioEdit()}
          </View>
      </View>
    } else {
          return <View style={{flex: 4, flexDirection: 'row'}} >
              <View style={{flex: 4, flexDirection: 'column'}}>
                  <Text style={styles.typeText}></Text>
                  {this.renderBio()}
              </View>
          </View>
    }
  }
  private renderTopBar = () => {
    return <View style={[styles.center]}><Text></Text>
        <Text style={styles.titleText}>Edit Info</Text>
        </View>
  }
  private renderProfilePictures = () => {
        return <View style={{flex: 4, flexDirection: 'row', borderBottomColor: '#D3D3D3',
            borderBottomWidth: 3}}>
                    <View style={{flex: 4, margin: 4, justifyContent: 'flex-end', backgroundColor: 'steelblue'}}>
                        <View style={{alignSelf: 'flex-end'}}><Icon name='add-circle' size={50} color='#EFEFEF'
                              onPress={() => {
                               //TODO: INSERT CAMERA ROLL
                              }}
                        /></View>
                    </View>
                    <View style={{flex: 2, margin: 4, marginTop: 4, backgroundColor: '#EFEFEF'}} >
                          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', backgroundColor: 'midnightblue'}}>
                            <View style={{alignSelf: 'flex-end'}}><Icon name='add-circle' size={30} color='#EFEFEF'
                                  onPress={() => {
                                   //TODO: INSERT CAMERA ROLL
                                  }}
                            /></View>
                          </View>
                          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', backgroundColor: 'steelblue'}}>
                            <View style={{alignSelf: 'flex-end'}}><Icon name='add-circle' size={30} color='#EFEFEF'
                                  onPress={() => {
                                   //TODO: INSERT CAMERA ROLL
                                  }}
                            /></View>
                          </View>
                    </View>
            </View>
    }

    renderNameEdit() {
      return <View style={{flex: 1.3, marginTop: 8, flexDirection: 'column', borderBottomColor: '#D3D3D3',  borderBottomWidth: 1}} >
        <View style={[styles.textContainer]}>
      <TextInput maxLength={20}
        style={styles.titleText}
        placeholder={this.state.name}
        onChangeText={(name) => this.setState({name})}
      />
            <Text style={styles.titleText}>{this.state.name}, {this.state.age}</Text>
      </View>
      <View style={[styles.textContainer]}>
            <View style={{flex: 2, flexDirection: 'row'}}>
            <Button
              onPress = {() => {this.onTextSubmit('name')}}
              title="Confirm"
              color="#841584"
              accessibilityLabel="Confirm"
            />
            </View>
        </View>
        </View>
    }

    renderName() {
      return <View style={{flex: 1.3, marginTop: 8, flexDirection: 'column', borderBottomColor: '#D3D3D3',  borderBottomWidth: 1}}>
      <View style={[styles.textContainer]}>
            <Text style={styles.titleText}>{this.state.name}, {this.state.age}</Text>
      </View>
      <View style={[styles.textContainer]}>
              <View style={{flex: 2, flexDirection: 'row'}}>
              <Button
                onPress = {() => {this.toggleNameEdit(true)}}
                title="Edit My Name"
                color="#841584"
                accessibilityLabel="Edit My Name"
              />
              </View>
          </View>
          </View>
    }

    private renderBio = () => {
      return <View style={[styles.textContainer]}>
        <Text style={styles.typeText}>Bio</Text>
        <View style={{padding: 10}}>
            <Text style={styles.bioText}>{this.state.bio}</Text>
        </View>
          <View style={{flex: 2, flexDirection: 'row', alignSelf: 'flex-start'}}>
        <Button
          onPress = {() => {this.toggleBioEdit(true)}}
          title="Edit Bio"
          color="#841584"
          accessibilityLabel="Edit Bio"
        />
        </View>
      </View>
    }

    private renderBioEdit = () => {
      return <View style={[styles.textContainer]}>
        <Text style={styles.typeText}>Bio</Text>
        <View style={{padding: 10}}>
            <TextInput maxLength={240}
              style={styles.bioText}
              placeholder={this.state.bio}
              onChangeText={(bio) => this.setState({bio})}
            />
        </View>
        <Button
          onPress = {() => {this.onTextSubmit('bio')}}
          title="Confirm Bio"
          color="#841584"
          accessibilityLabel="Confirm Bio"
        />
      </View>
    }

    private onTextSubmit(input: string) {
      if (input == 'name'){
        if (!ALPHA_REGEX.test(this.state.name)) {
          Alert.alert(
            'Invalid Name Format, Try Again',
          )
        } else {
            this.toggleNameEdit(false)
        }
      } else if (input == 'bio') {
         var cleanString = this.state.bio.replace(/[|*{};$%"<>()]/g, "");
         cleanString = cleanString.replace(/[&]/g, "and");
         cleanString = cleanString.replace(/[+]/g, "plus");
         cleanString = cleanString.replace(/[@]/g, "at");
         cleanString = cleanString.replace(/[=]/g, "equals");
         this.setState({bio: cleanString});
         this.toggleBioEdit(false);
      }

    }

    private renderLogoutSection = () => {
      return <View style={{flex: 1, flexDirection: 'row'}} >
          <View style={[styles.container, styles.center]}>
              <Button onPress = {() => {this.toggleModal(true)}} title='Settings Menu'/>
          </View>
      </View>
    }
/*****************************************************************************/
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
  },
  center: {
    flexDirection: 'column',
    borderBottomColor: '#D3D3D3',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  textContainer: {
    paddingLeft: 5,
    flex: 2,
    flexDirection: 'column',
    backgroundColor: 'white'
  },
  titleText:{
    marginTop: 3,
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    color: '#3f3f3f',
    alignItems: 'center',
  },
  typeText:{

    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    color: '#595959',
  },
  bioText: {
    fontSize: 20,
    fontFamily: 'Helvetica'
  }
})
