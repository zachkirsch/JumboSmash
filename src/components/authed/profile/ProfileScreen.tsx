import { flatten } from 'lodash'
import React, { PureComponent } from 'react'
import {
  Alert,
  Animated,
  Image,
  Keyboard,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect, Dispatch } from 'react-redux'
import { ActionSheetProps, connectActionSheet } from '@expo/react-native-action-sheet'
import { Images } from '../../../assets'
import { RootState } from '../../../redux'
import {
  ImageUri,
  ProfileReact,
  swapImages,
  TagSectionType,
  updateBio,
  updateImage,
  updateMajor,
  updatePreferredName,
} from '../../../services/profile'
import { LoadableValue } from '../../../services/redux'
import { CircleButton, JSText, JSTextInput } from '../../common'
import SwipeScreen from '../swipe/SwipeScreen'
import PhotosSection from './PhotosSection'
import SettingsSection from './SettingsSection'
import TagsSection from './TagsSection'

interface State {
  previewingCard: boolean
  viewingCoC: boolean
  preferredName: string
  major: string
  bio: string
  saveRequired: boolean
  saveButtonOpacity: Animated.Value
}

interface OwnProps {}

interface StateProps {
  images: Array<LoadableValue<ImageUri>>
  preferredName: string
  bio: string
  major: string
  tags: TagSectionType[]
  reacts: ProfileReact[]
}

interface DispatchProps {
  updatePreferredName: (name: string) => void,
  updateBio: (bio: string) => void,
  updateMajor: (major: string) => void,
  updateImage: (index: number, imageUri: string, mime: string) => void,
  swapImages: (index1: number, index2: number) => void
}

type Props = ActionSheetProps<NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>>

const MAX_BIO_LENGTH = 1000

@connectActionSheet
class ProfileScreen extends PureComponent<Props, State> {

  private photosSection: PhotosSection

  constructor(props: Props) {
    super(props)
    this.state = {
      previewingCard: false,
      viewingCoC: false,
      preferredName: props.preferredName,
      major: props.major,
      bio: props.bio,
      saveRequired: false,
      saveButtonOpacity: new Animated.Value(0),
    }
  }

  componentDidMount() {
    this.props.navigation.addListener('didBlur', () => {
      Keyboard.dismiss()
      this.photosSection.collapseImages()
    })
  }

  render() {
    return (
      <View>
        {this.renderProfilePreviewModal()}
        <ScrollView keyboardShouldPersistTaps={'handled'}>
          <PhotosSection
            images={this.props.images}
            swapImages={this.props.swapImages}
            updateImage={this.props.updateImage}
            showActionSheetWithOptions={this.props.showActionSheetWithOptions}
            ref={ref => this.photosSection = ref}
          />
          {this.renderPersonalInfo()}
          {this.renderTags()}
          {this.renderReacts()}
          <SettingsSection
            block={this.navigateTo('BlockScreen')}
            viewCoC={this.navigateTo('ReviewCoCScreen')}
            previewProfile={this.previewProfile}
          />
        </ScrollView>
        {this.renderSaveButton()}
      </View>
    )
  }

  private navigateTo = (screen: string) => () => this.props.navigation.navigate(screen)

  private renderSaveButton = () => {
    const style = [styles.saveButton, {
      opacity: this.state.saveButtonOpacity,
    }]
    return (
      <CircleButton
        IconClass={FontAwesome}
        iconName='save'
        iconColor={'lightgray'}
        iconSize={20}
        style={style}
        onPress={this.save}
      />
    )
  }

  private renderProfilePreviewModal = () => {
    const preview = {
      user: {
        id: -1,
        preferredName: this.state.preferredName,
        bio: this.state.bio,
        images: this.props.images.map((image) => image.value.uri).filter((image) => image),
      },
      onCompleteSwipe: this.setPreviewState(false),
    }

    return (
      <Modal
        animationType='fade'
        transparent={false}
        visible={this.state.previewingCard}
        onRequestClose={this.setPreviewState(false)}
      >
        <SwipeScreen
          preview={preview}
        />
      </Modal>
    )
  }

  private setPreviewState = (previewingCard: boolean) => () => {
    this.setState({
      previewingCard,
    })
  }

  private renderTags = () => {
    const tags = flatten(this.props.tags.map((section) => section.tags.filter((tag) => tag.selected)))

    let toRender
    if (tags.length > 0) {
      toRender = <TagsSection tags={tags} />
    } else {
      toRender = <JSText style={styles.underline}>Tap to edit</JSText>
    }

    return (
      <View style={styles.personalInfo}>
        <JSText fontSize={13} bold style={styles.tagsTitle}>TAGS</JSText>
        <TouchableOpacity onPress={this.navigateTo('TagsScreen')}>
          {toRender}
        </TouchableOpacity>
      </View>
    )
  }

  private renderReact = (react: ProfileReact) => {

    let toRender
    switch (react.type) {
      case 'emoji':
        toRender = <JSText fontSize={20} style={styles.reacts}>{react.emoji}</JSText>
        break
      case 'image':
        toRender = (
          <Image
            source={Images[react.imageName]}
            style={styles.smallReact}
          />
        )
    }

    return (
      <View style={styles.reactGroup}>
        {toRender}
        <JSText fontSize={12} style={styles.reactNum}>{`x ${react.count}`}</JSText>
      </View>
    )
  }

  private renderReacts = () => {

    const reactColumns = []
    for (let i = 0; i < this.props.reacts.length; i += 2) {
      reactColumns.push(
        <View style={styles.reactColumn} key={i}>
          {this.renderReact(this.props.reacts[i])}
          {this.renderReact(this.props.reacts[i + 1])}
        </View>
      )
    }

    return (
      <View style={styles.personalInfo}>
        <JSText fontSize={13} bold style={styles.reactsTitle}>REACTS RECEIVED</JSText>
        <View style={styles.reactColumns}>
          {reactColumns}
        </View>
      </View>
    )
  }

  private renderPreferredName = () => (
    <View>
      <JSText fontSize={13} bold style={styles.preferredNameTitle}>MY PREFERRED NAME</JSText>
      <View style={styles.preferredNameContainer}>
        <JSTextInput
          maxLength={30}
          fontSize={22}
          style={styles.preferredName}
          value={this.state.preferredName}
          onChangeText={this.updatePreferredName}
          autoCorrect={false}
          selectTextOnFocus
        />
        <JSText style={styles.lastName} fontSize={22}>Zaninovich</JSText>
      </View>
    </View>
  )

  private renderMajor = () => (
    <View>
      <JSText fontSize={13} bold style={styles.majorTitle}>MAJOR AND MINOR</JSText>
      <JSTextInput
        maxLength={30}
        fontSize={22}
        value={this.state.major}
        onChangeText={this.updateMajor}
        autoCorrect={false}
        selectTextOnFocus
        style={styles.major}
      />
    </View>
  )

  private renderBio = () => (
    <View>
      <JSTextInput
        multiline
        maxLength={MAX_BIO_LENGTH}
        value={this.state.bio}
        onChangeText={this.updateBio}
        placeholder={'Actually, Monaco and I...'}
        fontSize={17}
        fancy
        autoCorrect={false}
        style={styles.bio}
        underlineColorAndroid='transparent'
      />
      <JSText style={styles.bioCharacterCount}>
        {MAX_BIO_LENGTH - this.state.bio.length}
      </JSText>
    </View>
  )

  private renderPersonalInfo = () => {
    // bio is *first* because flexDirection is reverse (so that shadow doesn't cover the bio)
    return (
      <View style={styles.personalInfoContainer}>
        {this.renderBio()}
        <View style={styles.personalInfo}>
          {this.renderPreferredName()}
          {this.renderMajor()}
          <JSText fontSize={13} bold style={styles.aboutMeTitle}>ABOUT ME</JSText>
        </View>
      </View>
    )
  }

  private previewProfile = () => {
    let alertText = ''
    if (this.props.images.length === 0) {
      alertText = 'You need to choose at least one image'
    } else if (!this.state.preferredName) {
      alertText = 'You need a first name!'
    }
    if (!alertText) {
      this.setState({ previewingCard: true }, () => this.photosSection.collapseImages())
    } else {
      Alert.alert('Oops', alertText)
    }
  }

  private updateBio = (bio: string) => {
    this.setState({ bio })
    this.updateSavedStatus(this.saveRequired({
      major: this.state.major,
      preferredName: this.state.preferredName,
      bio,
    }))
  }

  private updateMajor = (major: string) => {
    this.setState({ major })
    this.updateSavedStatus(this.saveRequired({
      bio: this.state.bio,
      preferredName: this.state.preferredName,
      major,
    }))
  }

  private updatePreferredName = (preferredName: string) => {
    this.setState({ preferredName })
    this.updateSavedStatus(this.saveRequired({
      major: this.state.major,
      bio: this.state.bio,
      preferredName,
    }))
  }

  private saveRequired = (currentState: {bio: string, major: string, preferredName: string}) => {
    return this.props.bio !== currentState.bio
      || this.props.major !== currentState.major
      || this.props.preferredName !== currentState.preferredName
  }

  private updateSavedStatus = (saveRequired: boolean) => {
    if (saveRequired !== this.state.saveRequired) {
      this.setState({saveRequired})
      Animated.timing(
        this.state.saveButtonOpacity,
        {
          toValue: saveRequired ? 0.8 : 0,
          duration: 100,
        }
      ).start()
    }
  }

  private save = () => {
    this.props.updateBio(this.state.bio)
    this.props.updateMajor(this.state.major)
    this.props.updatePreferredName(this.state.preferredName)
    this.updateSavedStatus(false)
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    preferredName: state.profile.preferredName.value,
    bio: state.profile.bio.value,
    major: state.profile.major.value,
    tags: state.profile.tags.value,
    images: state.profile.images,
    reacts: state.profile.reacts.value,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    updatePreferredName: (name: string) => dispatch(updatePreferredName(name)),
    updateBio: (bio: string) => dispatch(updateBio(bio)),
    updateMajor: (major: string) => dispatch(updateMajor(major)),
    updateImage: (index: number, imageUri: string, mime: string) => {
      dispatch(updateImage(index, imageUri, mime))
    },
    swapImages: (index1: number, index2: number) => dispatch(swapImages(index1, index2)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)

const styles = StyleSheet.create({
  bio: {
    marginHorizontal: 0,
    textAlign: 'left',
    paddingTop: 15,
    paddingLeft: 20,
    paddingBottom: 20,
    paddingRight: 25,
    height: 175,
  },
  bioCharacterCount: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    color: 'gray',
  },
  personalInfoContainer: {
    flex: 1,
    flexDirection: 'column-reverse',
  },
  personalInfo: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  aboutMeTitle: {
    marginBottom: 5,
  },
  major: {
    marginBottom: 40,
  },
  majorTitle: {
    marginBottom: 5,
  },
  preferredNameContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  preferredNameTitle: {
    marginBottom: 5,
  },
  preferredName: {
    flexGrow: 1,
    flexShrink: 1,
    marginRight: 10,
  },
  lastName: {
    color: 'gray',
  },
  tagsTitle: {
    marginBottom: 10,
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
  reactsTitle: {
    marginTop: 20,
    marginBottom: 10,
  },
  reacts: {
    fontWeight: '300',
  },
  reactNum: {
    marginLeft: 4,
    fontWeight: '300',
    color: 'rgba(41,41,44,0.76)',
  },
  smallReact: {
      paddingVertical: 15,
      width: 25,
      height: 25,
      justifyContent: 'center',
  },
  underline: {
    textDecorationLine: 'underline',
    textDecorationColor: '#D5DCE2',
  },
  saveButton: {
    position: 'absolute',
    paddingBottom: 5,
    marginHorizontal: 0,
    height: 40,
    width: 40,
    top: 20,
    right: 20,
    borderRadius: 20,
    backgroundColor: '#0F52BA',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(172, 203, 238, 0.75)',
        shadowRadius: 10,
        shadowOpacity: 1,
        shadowOffset: {
          width: 0,
          height: 0,
        },
      },
    }),
    ...Platform.select({
      android: {
        elevation: 5,
      },
    }),
  },
})
