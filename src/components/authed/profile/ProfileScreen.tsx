import React, { PureComponent } from 'react'
import {
  Alert,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect, Dispatch } from 'react-redux'
import { ActionSheetProps, connectActionSheet } from '@expo/react-native-action-sheet'
import { flatten } from 'lodash'
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
  onChangePreferredNameTextInput,
  onChangeMajorTextInput,
  onChangeBioTextInput,
} from '../../../services/profile'
import { LoadableValue } from '../../../services/redux'
import { setTabBarOverlay, clearTabBarOverlay } from '../../../services/navigation'
import { JSText, JSTextInput, RectangleButton } from '../../common'
import PhotosSection from './PhotosSection'
import SettingsSection from './SettingsSection'
import TagsSection from './TagsSection'

interface State {
  previewingCard: boolean
  viewingCoC: boolean
  preferredName: string
  major: string
  bio: string
  photosSectionRequiresSave: boolean
}

interface OwnProps {}

interface StateProps {
  images: Array<LoadableValue<ImageUri>>
  preferredName: LoadableValue<string>
  bio: LoadableValue<string>
  major: LoadableValue<string>
  tags: TagSectionType[]
  reacts: ProfileReact[]
}

interface DispatchProps {
  onChangePreferredNameTextInput: (preferredName: string) => void
  onChangeMajorTextInput: (major: string) => void
  onChangeBioTextInput: (bio: string) => void
  updatePreferredName: (preferredName: string) => void
  updateBio: (bio: string) => void
  updateMajor: (major: string) => void
  updateImage: (index: number, imageUri: string, mime: string) => void
  swapImages: (index1: number, index2: number) => void
  setTabBarOverlay: (component: () => JSX.Element) => void
  clearTabBarOverlay: () => void
}

type Props = ActionSheetProps<NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>>

const MAX_BIO_LENGTH = 1000

@connectActionSheet
class ProfileScreen extends PureComponent<Props, State> {

  private photosSection: PhotosSection

  constructor(props: Props) {
    super(props)

    function getInitialValue<T>(item: LoadableValue<T>) {
      if (item.localValue === undefined) {
        return item.value
      } else {
        return item.localValue
      }
    }

    this.state = {
      previewingCard: false,
      viewingCoC: false,
      preferredName: getInitialValue(props.preferredName),
      major: getInitialValue(props.major),
      bio: getInitialValue(props.bio),
      photosSectionRequiresSave: false,
    }
  }

  componentDidMount() {
    this.updateSaveOverlay()
    this.props.navigation.addListener('didBlur', () => {
      Keyboard.dismiss()
    })
  }

  render() {
    return (
      <View>
        <ScrollView keyboardShouldPersistTaps='handled'>
          <PhotosSection
            images={this.props.images}
            swapImages={this.props.swapImages}
            updateImage={this.props.updateImage}
            showActionSheetWithOptions={this.props.showActionSheetWithOptions}
            saveRequired={this.markPhotosSectionAsRequiringSave}
            ref={ref => this.photosSection = ref}
          />
          {this.renderPersonalInfo()}
          {this.renderTags()}
          {this.renderReacts()}
          <SettingsSection
            block={this.navigateTo('BlockScreen')}
            viewCoC={this.navigateTo('ReviewCoCScreen')}
            previewProfile={this.previewProfile()}
          />
        </ScrollView>
      </View>
    )
  }

  private navigateTo<T>(screen: string, props?: T) {
    return () => this.props.navigation.navigate(screen, props)
  }

  private previewProfile = () => () => {
    this.ifSaveable(() => {
      this.navigateTo('ProfilePreviewScreen', {
        preview: {
          id: -1,
          preferredName: this.state.preferredName,
          bio: this.state.bio,
          images: this.props.images.map((image) => image.value.uri).filter((image) => image),
          tags: flatten(this.props.tags.map(section => section.tags)).filter(tag => tag.selected),
        },
      })()

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
        toRender = <JSText fontSize={23} style={styles.reacts}>{react.emoji}</JSText>
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

  private updatePreferredName = (preferredName: string) => {
    this.setState({ preferredName }, this.updateSaveOverlay)
    this.props.onChangePreferredNameTextInput(preferredName)
  }

  private updateMajor = (major: string) => {
    this.setState({ major }, this.updateSaveOverlay)
    this.props.onChangeMajorTextInput(major)
  }

  private updateBio = (bio: string) => {
    this.setState({ bio }, this.updateSaveOverlay)
    this.props.onChangeBioTextInput(bio)
  }

  private updateSaveOverlay = () => {
    if (this.saveRequired()) {
      const saveOverlay = (
        <View style={styles.saveOverlay}>
          <RectangleButton
            label='Revert'
            style={styles.saveButton}
            containerStyle={styles.saveButtonContainer}
            onPress={this.revert}
          />
          <RectangleButton
            active
            label='Save'
            style={styles.saveButton}
            containerStyle={styles.saveButtonContainer}
            onPress={this.save}
          />
        </View>
      )
      this.props.setTabBarOverlay(() => saveOverlay)
    } else {
      this.props.clearTabBarOverlay()
    }
  }

  private markPhotosSectionAsRequiringSave = () => {
    this.setState({
      photosSectionRequiresSave: true,
    }, this.updateSaveOverlay)
  }

  private saveRequired = () =>
    this.state.photosSectionRequiresSave
    || this.props.bio.value !== this.state.bio
    || this.props.major.value !== this.state.major
    || this.props.preferredName.value !== this.state.preferredName

  private revert = () => {
    const revert = () => {
      this.setState({
        bio: this.props.bio.value,
        major: this.props.major.value,
        preferredName: this.props.preferredName.value,
        photosSectionRequiresSave: false,
      })
      this.props.clearTabBarOverlay()
      this.photosSection.revert()
    }

    Keyboard.dismiss()

    // setTimeout is used so that the keyboard actually has time to close before the alert shows
    setTimeout(() => Alert.alert(
      '',
      'Are you sure you want to revert your changes?',
      [
        {text: 'No', style: 'cancel'},
        {text: 'Yes', onPress: revert, style: 'destructive'},
      ]
    ), 50)
  }

  private save = () => {
    Keyboard.dismiss()

    // setTimeout is used so that the keyboard actually has time to close before the alert shows
    setTimeout(() => {
      this.ifSaveable(() => {
        this.props.updateBio(this.state.bio)
        this.props.updateMajor(this.state.major)
        this.props.updatePreferredName(this.state.preferredName)
        this.photosSection.save()
        this.props.clearTabBarOverlay()
        this.setState({
          photosSectionRequiresSave: false,
        })
      })
    }, 50)
  }

  // if the current profile is "saveable", then the callback is called.
  // otherwise, an alert is shown with the reason that the profile isn't saveable.
  private ifSaveable = (callback: () => void) => {
    let alertText = ''
    if (this.props.images.length === 0 && false) {
      alertText = 'You need to choose at least one image'
    } else if (!this.state.preferredName) {
      alertText = 'You need a first name!'
    }
    if (!alertText) {
      callback()
    } else {
      Alert.alert('Oops', alertText)
    }
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    preferredName: state.profile.preferredName,
    bio: state.profile.bio,
    major: state.profile.major,
    tags: state.profile.tags.value,
    images: state.profile.images,
    reacts: state.profile.reacts.value,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    onChangePreferredNameTextInput: (preferredName: string) => dispatch(onChangePreferredNameTextInput(preferredName)),
    onChangeMajorTextInput: (major: string) => dispatch(onChangeMajorTextInput(major)),
    onChangeBioTextInput: (bio: string) => dispatch(onChangeBioTextInput(bio)),
    updatePreferredName: (preferredName: string) => dispatch(updatePreferredName(preferredName)),
    updateBio: (bio: string) => dispatch(updateBio(bio)),
    updateMajor: (major: string) => dispatch(updateMajor(major)),
    updateImage: (index: number, imageUri: string, mime: string) => {
      dispatch(updateImage(index, imageUri, mime))
    },
    swapImages: (index1: number, index2: number) => dispatch(swapImages(index1, index2)),
    setTabBarOverlay: (component: () => JSX.Element) => dispatch(setTabBarOverlay(component)),
    clearTabBarOverlay: () => dispatch(clearTabBarOverlay()),
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
    height: 80,
    justifyContent: 'space-around',
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
  saveOverlay: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 20 : 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  saveButton: {
    flex: 1,
    paddingHorizontal: 0,
  },
  saveButtonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
})
