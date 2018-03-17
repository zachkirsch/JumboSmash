import React, { PureComponent } from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { JSText, JSTextInput } from '../../generic/index'
import { RootState } from '../../../redux'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { updatePreferredName, updateBio, updateMajor, updateImages } from '../../../services/profile'
import PhotosSection from './PhotosSection'
import SettingsSection from './SettingsSection'
import SwipeScreen from '../swipe/SwipeScreen'
import { CodeOfConductScreen } from '../../login'

interface State {

  previewingCard: boolean
  viewingCoC: boolean

  preferredName: string
  major: string
  bio: string

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

interface OwnProps {}

interface StateProps {
  images: string[]
  preferredName: string
  tags: string[]
  bio: string
  major: string
}

interface DispatchProps {
  onSubmitName: (name: string) => void,
  onSubmitBio: (bio: string) => void,
  onSubmitMajor: (major: string) => void,
  updateImages: (images: string[]) => void,
}

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>

class ProfileScreen extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {

      previewingCard: false,
      viewingCoC: false,

      preferredName: props.preferredName || '',
      major: props.major || '',
      bio: props.bio || '',

      react1: 10,
      react2: 10,
      react3: 10,
      react4: 1000,
      react5: 100,
      react6: 10,
      react7: 10,
      react8: 10,
      chosentags: this.props.tags,
    }
  }

  render() {
    return (
      <View>
      <Modal
        animationType='fade'
        transparent={false}
        visible={this.state.previewingCard}
        onRequestClose={() => this.setState({previewingCard: false})}
      >
        <SwipeScreen
          preview={{
            name: this.state.preferredName,
            imageUris: this.props.images.filter(image => image),
            onCompleteSwipe: () => this.setState({previewingCard: false}),
          }}
        />
      </Modal>
      <Modal
        animationType='slide'
        transparent={false}
        visible={this.state.viewingCoC}
        onRequestClose={() => this.setState({viewingCoC: false})}
      >
        <CodeOfConductScreen
          buttonLabel={'Go Back'}
          onPress={() => this.setState({viewingCoC: false})}
        />
      </Modal>
      <ScrollView>
        <PhotosSection images={this.props.images} updateImages={this.props.updateImages}/>
        {this.renderBio()}
        {this.renderTags()}
        {this.renderReacts()}
        <SettingsSection
          block={() => this.props.navigation.navigate('BlockScreen')}
          viewCoC={() => this.setState({ viewingCoC: true })}
          previewProfile={() => this.setState({ previewingCard: true })}
        />
        </ScrollView>
        </View>
      )
  }

  private renderTags() {
    let tags
    if (this.props.tags.length === 0) {
      tags = <JSText style={styles.tags}>Tap to edit</JSText>
    } else {
      tags = (
        <View style={styles.tagsContainer}>
          {this.props.tags.map(tag => <JSText style={styles.tags} key={tag}>{tag}</JSText>)}
        </View>
      )
    }

    return (
      <View style={styles.bio}>
        <JSText fontSize={13} bold style={{marginBottom: 10}}>TAGS</JSText>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('TagsScreen')}>
          {tags}
        </TouchableOpacity>
      </View>
    )
  }

  private renderReacts() {
    return <View style={styles.bio}>
    <JSText fontSize={13} bold style={{marginTop: 20, marginBottom: 10}}>REACTS RECEIVED</JSText>
      <View style={styles.reactColumns}>
        <View style={styles.reactColumn}>
          <View style={styles.reactGroup}>
              <JSText fontSize={20} style={styles.reacts}>❤️</JSText>
              <JSText fontSize={12} style={styles.reactNum}>x {this.state.react1}</JSText>
          </View>
          <View style={styles.reactGroup}>
              <JSText fontSize={20} style={styles.reacts}>🔥</JSText>
              <JSText fontSize={12} style={styles.reactNum}>x {this.state.react2}</JSText>
          </View>
        </View>
        <View style={styles.reactColumn}>
          <View style={styles.reactGroup}>
              <JSText fontSize={20} style={styles.reacts}>😂</JSText>
              <JSText fontSize={12} style={styles.reactNum}>x {this.state.react3}</JSText>
          </View>
          <View style={styles.reactGroup}>
              <JSText fontSize={20} style={styles.reacts}>😮</JSText>
              <JSText fontSize={12} style={styles.reactNum}>x {this.state.react4}</JSText>
          </View>
        </View>
        <View style={styles.reactColumn}>
          <View style={styles.reactGroup}>
              <JSText fontSize={20} style={styles.reacts}>🐘</JSText>
              <JSText fontSize={12} style={styles.reactNum}>x {this.state.react5}</JSText>
          </View>
          <View style={styles.reactGroup}>
            <Image
              source={require('../../../img/tonymonaco.png')}
              style={styles.smallReact}
            />
              <JSText fontSize={12} style={styles.reactNum}>x {this.state.react6}</JSText>
          </View>
        </View>
        <View style={styles.reactColumn}>
          <View style={styles.reactGroup}>
            <Image
              source={require('../../../img/goBos.png')}
              style={styles.smallReact}
            />
              <JSText fontSize={12} style={styles.reactNum}>x {this.state.react7}</JSText>
          </View>
          <View style={styles.reactGroup}>
              <JSText fontSize={20} style={styles.reacts}>🎓</JSText>
              <JSText fontSize={12} style={styles.reactNum}>x {this.state.react8}</JSText>
          </View>
        </View>
      </View>
    </View>
  }

  private renderBio() {
    return (
      <View style={{flex: 1, flexDirection: 'column-reverse'}}>
        <JSTextInput
          multiline
          maxLength={1000}
          value={this.state.bio}
          onChangeText={(bio) => this.setState({bio})}
          placeholder={'Actually, Monaco and I...'}
          fontSize={17}
          fancy
          autoCorrect={false}
          style={{marginHorizontal: 0, textAlign: 'left', padding: 20, paddingTop: 15, height: 175}}
          underlineColorAndroid='transparent'
        />
        <View style={styles.bio}>
          <JSText fontSize={13} bold style={{marginBottom: 5}}>MY PREFERRED NAME</JSText>
          <JSTextInput maxLength={30} fontSize={22}
            value={this.state.preferredName}
            onChangeText={(preferredName) => this.setState({preferredName})}
            selectTextOnFocus
          />
          <JSText style={{color: 'gray', fontStyle: 'italic', marginBottom: 30, marginTop: 5}}>
            {`Your name will appear as: ${this.state.preferredName.trim()} Zaninovich.`}
          </JSText>
          <JSText fontSize={13} bold style={{marginBottom: 5}}>MAJOR AND MINOR</JSText>
          <JSTextInput maxLength={30} fontSize={22}
            value={this.state.major}
            onChangeText={(major) => this.setState({major})}
            selectTextOnFocus
            style={{marginBottom: 40}}
          />
          <JSText fontSize={13} bold style={{marginBottom: 5}}>ABOUT ME</JSText>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    preferredName: state.profile.preferredName.value,
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleText: {
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
   alignSelf: 'flex-start',
 },
 signoff: {
  marginTop: 30,
},
signoffLeft: {
  margin: 20,
  alignSelf: 'flex-start',
  justifyContent: 'flex-start',
},
left: {
   flex: 1,
   flexDirection: 'column',
   borderBottomColor: '#D3D3D3',
   borderBottomWidth: 1,
   alignItems: 'center',
   padding: 1,
 },
 modal: {
   alignItems: 'center',
   padding: 5,
 },
  bio: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  buttons: {
    flex: 1,
    justifyContent: 'space-around',
    paddingVertical: 1,
  },
  overall: {
    flex: 10,
    height: 380,
  },
  text: {
  fontSize: 22,
  fontWeight: 'bold',
  fontFamily: 'Helvetica',
  color: '#595959',
},
  reactColumn: {
    flex: 1,
  },
  reactColumns: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '5%',
  },
  reactGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paddingcontainer: {
    flex: 0.3,
  },
  bioItem: {
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  bioInput: {
    fontSize: 22,
    fontWeight: '300',
    fontFamily: 'Avenir',
    width: '80%',
    borderBottomColor: 'rgba(172, 203, 238, 0.75)',
    borderBottomWidth: 1,
  },
  reacts: {
    fontWeight: '300',
  },
  reactNum: {
    marginLeft: 4,
    fontWeight: '300',
    color: 'rgba(41,41,44,0.76)',
  },
  photos: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bigPhotoFrame: {
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
      justifyContent: 'center',
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
  tags: {
    color: '#29292C',
    textDecorationLine: 'underline',
    textDecorationColor: '#D5DCE2',
    marginRight: 5,
  },
  smallPhotoColumn: {
    flex: 1.2,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  smallPhotoRow: {
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
    justifyContent: 'space-between',
  },
  stackCard: {
    backgroundColor: 'white',
  },
})
