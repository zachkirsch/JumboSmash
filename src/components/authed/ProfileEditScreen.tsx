import React, { PureComponent } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import ImagePicker, { Image as ImagePickerImage } from 'react-native-image-crop-picker'
import { connectActionSheet } from '@expo/react-native-action-sheet'
import { default as SettingsMenu } from './SettingsScreen'
import { default as SimpleLineIcons } from 'react-native-vector-icons/SimpleLineIcons'
import { default as Feather } from 'react-native-vector-icons/Feather'
import { JSText, JSTextInput, JSButton } from '../generic/index'
import { RootState } from '../../redux'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { updatePreferredName, updateBio, updateMajor, updateImages } from '../../services/profile'
import { ActionSheetOption, generateActionSheetOptions } from '../utils'

interface State {

  swapping: boolean
  swappingIndex: number

  react1: number,
  react2: number,
  react3: number,
  react4: number,
  react5: number,
  react6: number,
  react7: number,
  react8: number,
  chosentags: string[]
}

interface StateProps {
  images: string[],
  name: string,
  tags: string[]
  bio: string,
  major: string,
}
interface OwnProps {}
interface DispatchProps {
  onSubmitName: (name: string) => void,
  onSubmitBio: (bio: string) => void,
  onSubmitMajor: (major: string) => void,
  updateImages: (images: string[]) => void,
}

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>

const WIDTH = Dimensions.get('window').width

@connectActionSheet
class ProfileEditScreen extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      swapping: false,
      swappingIndex: -1,

      react1: 10,
      react2: 10,
      react3: 10,
      react4: 10,
      react5: 10,
      react6: 10,
      react7: 10,
      react8: 10,
      chosentags: this.props.tags,
    }
  }

  render() {
    return (
      <ScrollView>
        {this.renderPhotos()}
        {this.renderBio()}
        {this.renderTags()}
        {this.renderReacts()}
        <SettingsMenu
          Report={() => this.props.navigation.navigate('ReportScreen')}
          Block={() => this.props.navigation.navigate('BlockScreen')}
          CoC={() => this.props.navigation.navigate('CoCPrivacyScreen')}
        />
      </ScrollView>
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

  private renderAllTags() {
      return (
        this.state.chosentags.length == 0? (<Text style={styles.tags} onPress={() => this.props.navigation.navigate('TagsScreen')}>
                                            None yet - tap to set tags! </Text>) :
          this.state.chosentags.map((tag) => (<Text style={styles.tags} key={tag}> {tag} </Text>))
      )
  }
  private renderReacts(){
    return <View style={styles.bio}>
      <View style={styles.bioItem}>
          <JSText>Reacts</JSText>
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

  private renderPhoto = (index: number) => {

    let touchableDisabled = false
    let overlayIcon

    const swappingBigPhotoAndRenderingEmptyPhoto = (
      this.state.swapping
      && this.state.swappingIndex === 0
      && !this.props.images[index]
    )

    if (this.state.swapping) {
      if (swappingBigPhotoAndRenderingEmptyPhoto) {
        touchableDisabled = true
      } else if (this.state.swappingIndex !== index) {
        overlayIcon = (
          <SimpleLineIcons
            style={{backgroundColor: 'transparent'}}
            name={'target'}
            size={40}
            color='rgba(172,203,238,0.6)'
          />
        )
      }
    } else if (!this.props.images[index]) {
      overlayIcon = (
        <Feather
          style={{backgroundColor: 'transparent'}}
          name={'plus'}
          size={50}
          color='rgba(172,203,238,0.6)'
        />
      )
    }

    let image
    if (this.props.images[index]) {
      image = (
        <Image
          source={{uri: this.props.images[index]}}
          resizeMode='cover'
          style={[
            styles.photo,
            index === 0 ? styles.bigPhoto : styles.smallPhoto,
            this.state.swapping && this.state.swappingIndex === index && styles.semiTransparent,
          ]}>
        </Image>
      )
    } else {
      image = (
        <View
          style={[
            {
              justifyContent: 'center',
              alignItems: 'center',
            },
            styles.photo,
            index === 0 ? styles.bigPhoto : styles.smallPhoto,
            styles.emptyPhoto,
            swappingBigPhotoAndRenderingEmptyPhoto && styles.semiTransparent,
          ]}
        >
        </View>
      )
    }

    return (
      <View>
      {image}
      <TouchableWithoutFeedback disabled={touchableDisabled} onPress={() => this.onPressImage(index)}>
        <View style={styles.photoOverlay}>
          {overlayIcon}
        </View>
      </TouchableWithoutFeedback>
      </View>
    )
  }

  private renderPhotos() {

    return (
      <View style={styles.photosContainer}>
        <View style={styles.photosTopRowContainer}>
          {this.renderPhoto(0)}
          <View style={styles.smallPhotosTopRowContainer}>
            {this.renderPhoto(1)}
            {this.renderPhoto(2)}
          </View>
        </View>
        <View style={styles.photosBottomRowContainer}>
          {this.renderPhoto(3)}
          {this.renderPhoto(4)}
          {this.renderPhoto(5)}
        </View>
      </View>
    )
  }

  private onPressImage(index: number) {

    if (this.state.swapping) {
      const newImages = Array.from(this.props.images)
      const temp = newImages[index]
      newImages[index] = newImages[this.state.swappingIndex]
      newImages[this.state.swappingIndex] = temp
      this.props.updateImages(newImages)
      this.setState({
        swapping: false,
      })
      return
    }

    const buttons: ActionSheetOption[] = []

    // CHOOSE PHOTO BUTTON
    buttons.push({
      title: this.props.images[index] ? 'Change Photo' : 'Choose Photo',
      onPress: () => ImagePicker.openPicker({
        width: 1000,
        height: 1000,
        cropping: true,
        mediaType: 'photo',
        cropperToolbarTitle: 'Move to Crop',
      }).then((image: ImagePickerImage) => {
        const newImages = Array.from(this.props.images)
        newImages[index] = image.path
        this.props.updateImages(newImages)
      }),
    })

    if (this.props.images[index]) {

      // SWAP POSITION BUTTON
      const numPhotosChosen = this.props.images.filter((image: string) => image).length
      if (index !== 0 || numPhotosChosen > 1) {
        buttons.push({
          title: 'Swap Position',
          onPress: () => {
            this.setState({
              swapping: true,
              swappingIndex: index,
            })
          },
        })
      }
      if (index !== 0) {

        // REMOVE PHOTO BUTTON
        buttons.push({
          title: 'Remove Photo',
          onPress: () => {
            const newImages = Array.from(this.props.images)
            newImages[index] = undefined
            this.props.updateImages(newImages)
          },
          destructive: true,
        })
      }
    }

    this.props.showActionSheetWithOptions(...generateActionSheetOptions(buttons))
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    name: state.profile.preferredName.value,
    bio: state.profile.bio.value,
    major: state.profile.major.value,
    tags: state.profile.tags.value,
    images: state.profile.images.value,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    onSubmitName: (name: string) => dispatch(updatePreferredName(name)),
    onSubmitBio: (bio: string) => dispatch(updateBio(bio)),
    onSubmitMajor: (major: string) => dispatch(updateMajor(major)),
    updateImages: (images: string[]) => dispatch(updateImages(images)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditScreen)

const styles = StyleSheet.create({

  photosContainer: {
    flex: 1,
    height: WIDTH,
    padding: .05 * WIDTH,
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  photosTopRowContainer: {
    height: WIDTH * 7 / 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallPhotosTopRowContainer: {
    width: WIDTH * 4 / 15,
    justifyContent: 'space-between',
  },
  photosBottomRowContainer: {
    height: WIDTH * 4 / 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photo: {
    borderRadius: 5,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(172, 203, 238, 0.75)',
        shadowOpacity: 1,
        shadowRadius: .02 * WIDTH,
        width: 0,
        height: 0,
      },
    }),
    ...Platform.select({
      android: {
        elevation: 4,
      },
    }),
  },
  bigPhoto: {
    height: WIDTH * 7 / 12,
    width: WIDTH * 7 / 12,
  },
  smallPhoto: {
    height: WIDTH * 4 / 15,
    width: WIDTH * 4 / 15,
  },
  emptyPhoto: {
    backgroundColor: 'white',
  },

  semiTransparent: {
    opacity: 0.4,
  },
  hidden: {
    opacity: 0,
  },
  photoOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

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
  /*
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
  */
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
