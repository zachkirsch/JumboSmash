export { default as JSTextInput, TextInputRef, JSButton, JSText } from '../generic'
import React, { PureComponent } from 'react'
import { View, Text, TextInput, Image, StyleSheet, ScrollView } from 'react-native'
import { NavigationTabScreenOptions } from 'react-navigation'
import { Icon } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { JSButton, JSText, JSTextInput } from '../generic/index';

interface State {
  bio: string,
  avatarSource: string,
  name: string,
  major: string,
  modalVisible: boolean,
  nameEditing: boolean,
  bioEditing: boolean,
  react1: number,
  react2: number,
  react3: number,
  react4: number,
  react5: number,
  react6: number,
  react7: number,
  react8: number
}

const ALPHA_REGEX = /^[A-Za-z -']+$/


class ProfileEditScreen extends PureComponent<{}, State> {

  constructor(props: {}) {
     super(props);
     this.state = { bio: "I haven't set up a bio yet." +'\n' +"I have 240 characters to do so!",
                    avatarSource: 'none',
                    name: 'Dummy Name',
                    major: 'Undeclared',
                    modalVisible: false,
                    nameEditing: false,
                    bioEditing: false,
                    react1: 10,
                    react2: 10,
                    react3: 10,
                    react4: 10,
                    react5: 10,
                    react6: 10,
                    react7: 10,
                    react8: 10,
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
      <ScrollView >
        {this.renderPhotos()}
        <View style={styles.container}></View>
        {this.renderBio()}

        <View style={styles.bio}>
          <View style={styles.bioItem}>
              <JSText>Reacts Received </JSText>
                <View style={styles.reactRow}>
                    <View>
                        <JSText>❤️</JSText>
                        <JSText>{this.state.react1}</JSText>
                    </View>
                    <View style={{flex:1}}></View>
                    <View>
                        <JSText>🔥</JSText>
                        <JSText>{this.state.react2}</JSText>
                    </View>
                    <View>
                        <JSText>😂</JSText>
                        <JSText>{this.state.react3}</JSText>
                    </View>
                    <View>
                        <JSText>😮</JSText>
                        <JSText>{this.state.react4}</JSText>
                    </View>
                    <View>
                        <JSText>🐘</JSText>
                        <JSText>{this.state.react5}</JSText>
                    </View>
                    <View>
                        <JSText>🎓</JSText>
                        <JSText>{this.state.react6}</JSText>
                    </View>
                    <View>
                        <JSText>🎓</JSText>
                        <JSText>{this.state.react6}</JSText>
                    </View>
                    <View>
                    <Image
                      source={require('../img/tonymonaco.png')}
                      style={styles.small}
                    />
                        <JSText>{this.state.react6}</JSText>
                    </View>
                </View>
          </View>
        </View>
        {this.renderButtons()}
      </ScrollView>
    )
  }
  private renderButtons(){
    return <View>
    <View style={styles.buttons}>
      <JSButton label="View Profile"></JSButton>
    </View>
    <View style={styles.buttons}>
      <JSButton label="Settings"></JSButton>
    </View>
    <View style={styles.buttons}>
      <JSButton label="Help/Feedback"></JSButton>
    </View>
    </View>
  }
  private renderBio(){
    return  <View style={styles.bio}>
    <View style={styles.bioItem}>
        <JSText>My Preferred Name</JSText>
        <TextInput maxLength={30}
        style= {styles.bioInput}
        placeholder={this.state.name}
        onChangeText={(name) => this.setState({name})}
        />
    </View>
    <View style={styles.bioItem}>
        <JSText>Major and Minor </JSText>
        <TextInput maxLength={30}
        style= {styles.bioInput}
        placeholder={this.state.major}
        onChangeText={(name) => this.setState({name})}
        />
    </View>
      <View style={styles.bioItem}>
          <JSText>About Me </JSText>
      </View>
      <JSTextInput placeholder="240 character max"></JSTextInput>
  </View>
  }
  private renderPhotos(){
    //TODO: pull from db, put in each photo - for the first empty view, renderAddButton, then populate the other views
    return <View style={[styles.overall]}>
      <View style={styles.photos}>
          <View style={styles.bigPhotoFrame}>
          <View style={[styles.paddingcontainer]}></View>
            <View style={styles.photo}>
              {this.renderAddButton()}
            </View>
            <View style={{flex:0.1}}></View>
          </View>
          <View style={styles.smallPhotoColumn}>
            <View style={{flex:0.65}}></View>
            <View style={styles.photo}>
            </View>
            <View style={[styles.paddingcontainer]}></View>
            <View style={styles.photo}>
            </View>
            <View style={{flex:0.25}}></View>
          </View>
      </View>
        <View style={styles.smallPhotoRow}>
        <View style={{flex:0.35}}></View>
        <View style={styles.photo}>
        </View>
        <View style={{flex:0.35}}></View>
        <View style={styles.photo}>
        </View>
        <View style={{flex:0.35}}></View>
        <View style={styles.photo}>
        </View>
        <View style={{flex:0.18}}></View>
        </View>
    </View>
  }

  private renderAddButton(){
    return <View style={{alignSelf: 'flex-end'}}><Icon name='add-circle' size={50} color='#EFEFEF'
                   onPress={() => {
                    //TODO: INSERT CAMERA ROLL
                   }}
             /></View>
  }
}

export default ProfileEditScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bio: {
    flex: 8,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  buttons:{
    flex: 1,
    justifyContent: 'space-around',
    paddingVertical: 1,
  },
  overall:{
    flex:10,
    height: 380,
  },
  reactRow:{
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  paddingcontainer: {
    flex: 0.3,
  },
  bioItem:{
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  bioInput:{
    fontSize: 22,
    fontWeight: '300',
    fontFamily: 'Avenir',
    width: '80%',
    borderBottomColor: 'rgba(172, 203, 238, 0.75)',
    borderBottomWidth: 1
  },
  photos: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  bigPhotoFrame:{
    flex: 2.5,
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  }, small: {
      width: 10,
      height: 10
  },
  photo:{
    flex: 3,
    alignSelf: 'center',
    width: '90%',
    height: '90%',
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d6d7da',
    alignItems: 'baseline',
    justifyContent: 'flex-end'
  },
  smallPhotoColumn :{
    flex: 1.2,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  smallPhotoRow :{
    flex: 0.47,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  center: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    marginTop: 100,
    flex: 2,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: '10%',
  },
  message: {
    lineHeight: 29,
    color: 'black',
  },
  inputContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  errorMessage: {
    color: 'red',
    fontWeight: '500',
  },
  submitContainer: {
    flex: 1.8,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  submitButtonContainer: {
    flex: 4,
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
    justifyContent: 'space-between'
  },
})
