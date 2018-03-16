import React, { PureComponent } from 'react'
import { View, TouchableOpacity, Text, TextInput, Image, StyleSheet, ScrollView } from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import ImagePicker from 'react-native-image-picker'
import { default as SettingsMenu } from './SettingsScreen'
import { JSText, JSTextInput, JSButton } from '../generic/index';
import { ActionSheetProvider} from '@expo/react-native-action-sheet';
import { RootState } from '../../redux';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { updatePreferredName, updateBio, updateTags, updateMajor } from '../../services/profile';

interface State {
  bio: string,
  avatarSources: Array<{uri: string}>,
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
  react8: number,
  PhotoDimensionsBig: number[],
  PhotoDimensionsSmall: number[],
  chosentags: string[]
}

interface StateProps {
  name: string,
  tags: string[]
  bio: string,
  // Images: Array<{uri: string}>,
  major: string,
}
interface OwnProps {}
interface DispatchProps {
  onSubmitName: (name: string) => void,
  onSubmitBio: (bio: string) => void,
  onSubmitMajor: (major: string) => void,
}

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>

class ProfileEditScreen extends PureComponent<Props, State> {

  constructor(props: Props) {
     super(props);
     this.state = { bio: this.props.bio,
                    avatarSources: [{uri: 'https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg'}, //one default, 6 real spots
                                    {uri: 'https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg'},
                                    {uri: 'https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg'},
                                    {uri: 'https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg'},
                                    {uri: 'https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg'},
                                    {uri: 'https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg'},
                                    {uri: 'https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg'},],
                    name: this.props.name,
                    major: this.props.major,
                    PhotoDimensionsBig: [],
                    PhotoDimensionsSmall: [],
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
                    chosentags: this.props.tags
                  };
   }


  render() {
    return (
      <ActionSheetProvider>
      <ScrollView >
        {this.renderPhotos()}
        <View style={styles.container}></View>
        {this.renderBio()}
        {this.renderTags()}
        {this.renderReacts()}
        <View style={styles.buttons}>
          <JSButton onPress={() => this.props.navigation.goBack()} label="View Profile/Save Changes"></JSButton>
        </View>
        <SettingsMenu Report={() => this.props.navigation.navigate('ReportScreen')}
                      Block={() => this.props.navigation.navigate('BlockScreen')}
                      CoC={() => this.props.navigation.navigate('CoCPrivacyScreen')}
                      />
      </ScrollView>
      </ActionSheetProvider>
    )
  }


  private renderTags(){
    return <View style={styles.bio}>
    <View style={styles.bioItem}>
        <JSText onPress={() => this.props.navigation.navigate('TagsScreen')}>Tags </JSText>
          <View style={styles.reactRow}>
          {this.renderAllTags()}
            </View>
    </View>
    </View>
  }

  private renderAllTags(){
      return (
        this.state.chosentags.length == 0? (<Text style={styles.tags} onPress={() => this.props.navigation.navigate('TagsScreen')}>
                                            None yet - tap to set tags! </Text>) :
          this.state.chosentags.map((tag) => (<Text style={styles.tags} key={tag}> {tag} </Text>))
      )
  }
  private renderReacts(){
    return <View style={styles.bio}>
      <View style={styles.bioItem}>
          <JSText>Reaccs </JSText>
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

  private renderBio(){
    return  <View style={styles.bio}>
    <View style={styles.bioItem}>
        <JSText>My Preferred Name</JSText>
        <TextInput maxLength={30}
        style= {styles.bioInput}
        placeholder={this.state.name}
        onChangeText={(name) => this.setState({name})}
        onEndEditing={() => this.props.onSubmitName(this.state.name)}
        />
    </View>
    <View style={styles.bioItem}>
        <JSText>Major and Minor </JSText>
        <TextInput maxLength={30}
        style= {styles.bioInput}
        placeholder={this.state.major}
        onChangeText={(major) => this.setState({major})}
        onEndEditing={() => this.props.onSubmitMajor(this.state.major)}
        />
    </View>
      <View style={styles.bioItem}>
          <JSText>About Me </JSText>
      </View>
      <JSTextInput placeholder="240 chars max!" multiline={true} maxLength={240}
        onChangeText={(bio) => this.setState({bio})}
        onEndEditing={() => this.props.onSubmitBio(this.state.bio)}
        >{this.state.bio}</JSTextInput> 
  </View>
  }

  private renderPhotos(){
    //TODO: pull from db, put in each photo - for the first empty view, renderAddButton, then populate the other views
    return <View style={[styles.overall]}>
      <View style={styles.photos}>
          <View style={styles.bigPhotoFrame}>
          <View style={[styles.paddingcontainer]}></View>
            <TouchableOpacity style={styles.photo} onPress={() => this.ImagePick('1')}onLayout={(event) => {let {width, height} = event.nativeEvent.layout;
              this.setState({PhotoDimensionsBig: this.state.PhotoDimensionsBig.concat([width, height])}}}>
              <Image
                       style={{
                         width: this.state.PhotoDimensionsBig[0], height:this.state.PhotoDimensionsBig[1],
                         resizeMode: 'cover', borderRadius: 6,
                       }}
                       resizeMode='cover'
                       source={this.state.avatarSources[1]}
                     />
            </TouchableOpacity>
            <View style={{flex:0.1}}></View>
          </View>
          <View style={styles.smallPhotoColumn}>
            <View style={{flex:0.65}}></View>
            <View style={styles.photo}>
            {this.SmallImageLoad('2')}
            </View>
            <View style={[styles.paddingcontainer]}></View>
            <View style={styles.photo}>
              {this.SmallImageLoad('3')}
            </View>
            <View style={{flex:0.25}}></View>
          </View>
      </View>
        <View style={styles.smallPhotoRow}>
        <View style={{flex:0.35}}></View>
        <View style={styles.photo}>
          {this.SmallImageLoad('4')}
        </View>
        <View style={{flex:0.35}}></View>
        <View style={styles.photo}>
            {this.SmallImageLoad('5')}
        </View>
        <View style={{flex:0.35}}></View>
        <View style={styles.photo}>
            {this.SmallImageLoad('6')}
        </View>
        <View style={{flex:0.18}}></View>
        </View>
    </View>
  }

  private SmallImageLoad(key: string){
    return(
    <TouchableOpacity style={styles.photo} onPress={() => this.ImagePick(key)} onLayout={(event) => {let {width, height} = event.nativeEvent.layout;
      this.setState({PhotoDimensionsSmall: this.state.PhotoDimensionsSmall.concat([width, height])}}}>
      <Image
               style={{
                 width: this.state.PhotoDimensionsSmall[0]*1.1, height:this.state.PhotoDimensionsSmall[1],
                 resizeMode: 'cover', borderRadius: 6, alignSelf: 'flex-start'
               }}
               resizeMode='cover'
               source={this.state.avatarSources[parseInt(key)]}
             />
    </TouchableOpacity>
  )
  }

  private ImagePick(key: string){
    let options = {
          title: 'Select Avatar',
        customButtons: [
          {name: 'Delete', title: 'Delete Photo'},
        ],
        storageOptions: {
          skipBackup: true,
          path: 'images'
        }
      };

    let index = parseInt(key , 10 )
        ImagePicker.showImagePicker(options, (response) => {
           console.log('Response = ', response);
           if (response.didCancel) {
             console.log('User cancelled image picker');
           }
           else if (response.error) {
             console.log('ImagePicker Error: ', response.error);
           }
           else if (response.customButton) {
             let avatars = []
             avatars = this.state.avatarSources
             avatars[index] = avatars[0]
             this.setState({
               avatarSources: avatars
             });
             this.forceUpdate()
           }
           else {
             let source = { uri: response.uri };
             console.log(response.uri)
             // You can also display the image using data:
             // let source = { uri: 'data:image/jpeg;base64,' + response.data };
             let avatars = []
             avatars = this.state.avatarSources
             avatars[index] = source
             console.log(avatars[index] == source)
             this.setState({
               avatarSources: avatars
             });
             this.forceUpdate()
           }
         });
     }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    name: state.profile.preferredName.value,
    bio: state.profile.bio.value,
    major: state.profile.major.value,
    tags: state.profile.tags.value,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    onSubmitName: (name: string) => dispatch(updatePreferredName(name)),
    onSubmitBio: (bio: string) => dispatch(updateBio(bio)),
    onSubmitMajor: (major: string) => dispatch(updateMajor(major))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleText:{
  marginTop: 3,
  fontSize: 24,
  fontWeight: 'bold',
  fontFamily: 'Avenir',
  color: '#3f3f3f',
  alignItems: 'center',
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
  text:{
  fontSize: 22,
  fontWeight: 'bold',
  fontFamily: 'Helvetica',
  color: '#595959',
},
  reactRow:{
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
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
    borderColor: 'white',
    alignItems: 'baseline',
    justifyContent: 'flex-start'
  },
  tags:{
    textDecorationLine: 'underline'
  },
  smallPhotoColumn :{
    flex: 1.2,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingRight: 10
  },
  smallPhotoRow :{
    flex: 0.47,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,

  },
  center: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
  stackCard: {
    backgroundColor: 'white',
  },
})