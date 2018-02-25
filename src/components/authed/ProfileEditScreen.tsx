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
        {this.renderTags()}
        {this.renderReacts()}
        {this.renderButtons()}
      </ScrollView>
    )
  }

  private renderTags(){
    return <View style={styles.bio}>
    <View style={styles.bioItem}>
        <JSText onPress={() => alert("hello, put edit tags here")}>Tags </JSText>
          {this.renderAllTags()}
    </View>
    </View>
  }

  private renderAllTags(){
      //TODO: actually find the person's tags.
      return <View style={styles.reactRow}>
            <Text style={styles.tags}>Halligan Life</Text>
            <Text>, </Text>
            <Text style={styles.tags}>Downhill</Text>
            <Text>, </Text>
            <Text style={styles.tags}>KindleVan</Text>
      </View>
  }
  private renderReacts(){
    return <View style={styles.bio}>
      <View style={styles.bioItem}>
          <JSText>Reacts Received </JSText>
            <View style={styles.reactRow}>
                <View style={styles.reactRow}>
                    <Text style={styles.reacts}>❤️</Text>
                    <Text style={styles.reactNum}>x{this.state.react1}</Text>
                </View>
                <View style={styles.reactRow}>
                    <Text style={styles.reacts}>🔥</Text>
                    <Text style={styles.reactNum}>x{this.state.react2}</Text>
                </View>
                <View style={styles.reactRow}>
                    <Text style={styles.reacts}>😂</Text>
                    <Text style={styles.reactNum}>x{this.state.react3}</Text>
                </View>
                <View style={styles.reactRow}>
                    <Text style={styles.reacts}>😮</Text>
                    <Text style={styles.reactNum}>x{this.state.react4}</Text>
                </View>
              </View>
              <View style={styles.reactRow}>
                <View style={styles.reactRow}>
                    <Text style={styles.reacts}>🐘</Text>
                    <Text style={styles.reactNum}>x{this.state.react5}</Text>
                </View>
                <View style={styles.reactRow}>
                  <Image
                    source={require('../../img/tonymonaco.png')}
                    style={styles.smallReact}
                  />
                    <Text style={styles.reactNum}>x{this.state.react6}</Text>
                </View>
                <View style={styles.reactRow}>
                  <Image
                    source={require('../../img/goBos.png')}
                    style={styles.smallReact}
                  />
                    <Text style={styles.reactNum}>x{this.state.react7}</Text>
                </View>
                <View style={styles.reactRow}>
                    <Text style={styles.reacts}>🎓</Text>
                    <Text style={styles.reactNum}>x{this.state.react8}</Text>
                </View>
            </View>
      </View>
    </View>
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
    justifyContent: 'space-around',
    paddingVertical: 10,
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
  reacts:{
    fontSize: 25,
    fontWeight: '300'
  },
  reactNum:{
    paddingVertical: 10,
    fontSize: 10,
    fontWeight: '300'
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
  },
  smallReact: {
      paddingVertical: 15,
      width: 25,
      height: 25,
      justifyContent: 'center'
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
  tags:{
    textDecorationLine: 'underline'

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
