import React, { PureComponent } from 'react'
import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  findNodeHandle,
} from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect, Dispatch } from 'react-redux'
import { ActionSheetProps, connectActionSheet } from '@expo/react-native-action-sheet'
import { flatten } from 'lodash'
import { RootState } from '../../../redux'
import {
  ProfileReact,
  swapImages,
  updateBio,
  updateImage,
  updatePreferredName,
  onChangePreferredNameTextInput,
  onChangeBioTextInput,
  Tag,
  ProfileState,
} from '../../../services/profile'
import { LoadableValue } from '../../../services/redux'
import { setTabBarOverlay, clearTabBarOverlay } from '../../../services/navigation'
import { JSText, JSTextInput, JSImage  } from '../../common'
import PhotosSection from './PhotosSection'
import SettingsSection from './SettingsSection'
import TagsSection from './TagsSection'
import SaveOrRevert from './SaveOrRevert'

interface State {
  previewingCard: boolean
  viewingCoC: boolean
  preferredName: string
  bio: string
  photosSectionRequiresSave: boolean
}

interface OwnProps {}

interface StateProps {
  profile: ProfileState
}

interface DispatchProps {
  onChangePreferredNameTextInput: (preferredName: string) => void
  onChangeBioTextInput: (bio: string) => void
  updatePreferredName: (preferredName: string) => void
  updateBio: (bio: string) => void
  updateImage: (index: number, imageUri: string, mime: string) => void
  swapImages: (index1: number, index2: number) => void
  setTabBarOverlay: (component: () => JSX.Element) => void
  clearTabBarOverlay: () => void
}

type Props = ActionSheetProps<NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>>

const MAX_BIO_LENGTH = 1000

@connectActionSheet
class ProfileScreen extends PureComponent<Props, State> {

  private mainScrollView: any /* tslint:disable-line:no-any */
  private photosSection: PhotosSection | null
  private preferredNameTextInput: JSTextInput | null
  private bioTextInput: JSTextInput | null
  private tagsRequiredSave = false

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
      preferredName: getInitialValue(props.profile.preferredName),
      bio: getInitialValue(props.profile.bio),
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
    let containerStyle
    if (this.setupMode()) {
      containerStyle = {
        paddingTop: Platform.select({
          ios: 20,
          android: 0,
        }),
      }
    }

    return (
      <View>
        <ScrollView
          contentContainerStyle={containerStyle}
          keyboardShouldPersistTaps='handled'
          ref={ref => this.mainScrollView = ref}
        >
          <PhotosSection
            images={this.props.profile.images.toJS()}
            swapImages={this.props.swapImages}
            updateImage={this.props.updateImage}
            showActionSheetWithOptions={this.props.showActionSheetWithOptions!}
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
            startSmashing={this.setupMode() && this.save}
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
          ...this.props.profile,
          id: -1,
          preferredName: this.state.preferredName,
          bio: this.state.bio,
          images: this.photosSection!.images().filter(image => !!image),
          tags: this.getSelectedTags(),
        },
      })()

    })
  }

  private getSelectedTags = (): Tag[] => {
    return flatten(
      (this.props.profile.tags.localValue || this.props.profile.tags.value)
        .map(section => section.tags.filter(tag => tag.selected))
    )
  }

  private renderTags = () => {
    const tags = this.getSelectedTags()
    let toRender
    if (tags.length > 0) {
      toRender = <TagsSection tags={tags} />
    } else {
      toRender = <JSText style={styles.underline}>Tap to edit</JSText>
    }

    return (
      <View style={styles.personalInfo}>
        <JSText bold style={[styles.title, styles.tagsTitle]}>TAGS</JSText>
        <TouchableOpacity onPress={this.navigateTo('TagsScreen')}>
          {toRender}
        </TouchableOpacity>
      </View>
    )
  }

  private renderReact = (react: ProfileReact | undefined) => {

    if (react === undefined) {
      return null
    }

    let toRender
    switch (react.type) {
      case 'emoji':
        toRender = <JSText style={styles.emoji}>{react.emoji}</JSText>
        break
      case 'image':
        toRender = (
          <JSImage
            source={{uri: react.imageUri}}
            style={styles.imageReact}
            cache
          />
        )
    }

    return (
      <View style={styles.react}>
        {toRender}
        <JSText style={styles.reactNum}>{`x ${react.count}`}</JSText>
      </View>
    )
  }

  private renderReacts = () => {

    if (this.setupMode()) {
      return null
    }

    const reactColumns = []
    for (let i = 0; i < this.props.profile.reacts.value.length; i += 2) {
      reactColumns.push(
        <View style={styles.reactColumn} key={i}>
          {this.renderReact(this.props.profile.reacts.value[i])}
          {this.renderReact(this.props.profile.reacts.value[i + 1])}
        </View>
      )
    }

    return (
      <View style={styles.personalInfo}>
        <JSText bold style={[styles.title, styles.reactsTitle]}>REACTS RECEIVED</JSText>
        <View style={styles.reactColumns}>
          {reactColumns}
        </View>
      </View>
    )
  }

  private renderPreferredName = () => (
    <View>
      <JSText bold style={[styles.title, styles.preferredNameTitle]}>NAME</JSText>
      <View style={styles.preferredNameContainer}>
        <JSTextInput
          maxLength={30}
          style={[styles.bigInput, styles.preferredName]}
          value={this.state.preferredName}
          onChangeText={this.updatePreferredName}
          autoCorrect={false}
          selectTextOnFocus
          onFocus={this.onFocus('preferredName')}
          ref={ref => this.preferredNameTextInput = ref}
        />
        <JSText style={[styles.bigInput, styles.lastName]}>
          {this.props.profile.surname}
        </JSText>
      </View>
    </View>
  )

  private renderBio = () => (
    <View>
      <JSTextInput
        multiline
        maxLength={MAX_BIO_LENGTH}
        value={this.state.bio}
        onChangeText={this.updateBio}
        fancy
        autoCorrect={false}
        style={styles.bio}
        onFocus={this.onFocus('bio')}
        ref={ref => this.bioTextInput = ref}
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
          <JSText bold style={[styles.title, styles.aboutMeTitle]}>ABOUT ME</JSText>
        </View>
      </View>
    )
  }

  private onFocus = (inputName: 'preferredName' | 'bio') => () => {
    let ref: JSTextInput | null = null
    switch (inputName) {
      case 'preferredName':
        ref = this.preferredNameTextInput
        break
      case 'bio':
        ref = this.bioTextInput
        break
    }

    if (!ref || !this.mainScrollView) {
      return
    }

    // setTimeout is used so that the keyboard has time to open
    setTimeout(() => {
      this.mainScrollView
        .getScrollResponder()
        .scrollResponderScrollNativeHandleToKeyboard(findNodeHandle(ref), 90, true)
    }, 50)
  }

  private updatePreferredName = (preferredName: string) => {
    this.setState({ preferredName }, this.updateSaveOverlay)
    this.props.onChangePreferredNameTextInput(preferredName)
  }

  private updateBio = (bio: string) => {
    this.setState({ bio }, this.updateSaveOverlay)
    this.props.onChangeBioTextInput(bio)
  }

  private updateSaveOverlay = () => {
    if (this.setupMode()) {
      return
    }
    if (this.saveRequired()) {
      const saveOverlay = (
        <SaveOrRevert
          save={this.save}
          revert={this.revert}
          containerStyle={styles.saveOverlay}
          buttonContainerStyle={styles.saveButtonContainer}
          buttonStyle={styles.saveButton}
        />
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

  // ignores tags
  private saveRequired = () => {
    if (this.state.photosSectionRequiresSave
        || this.props.profile.bio.value !== this.state.bio
        || this.props.profile.preferredName.value !== this.state.preferredName) {
      return true
    }
    return this.tagsRequiredSave
  }

  private revert = () => {
    const revert = () => {
      this.setState({
        bio: this.props.profile.bio.value,
        preferredName: this.props.profile.preferredName.value,
        photosSectionRequiresSave: false,
      })
      this.props.clearTabBarOverlay()
      this.photosSection && this.photosSection.revert()
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
        this.props.updatePreferredName(this.state.preferredName)
        this.photosSection && this.photosSection.save()
        this.props.clearTabBarOverlay()
        if (!this.setupMode()) {
          this.setState({
            photosSectionRequiresSave: false,
          })
          this.tagsRequiredSave = false
        }
      })
    }, 50)
  }

  // if the current profile is "saveable", then the callback is called.
  // otherwise, an alert is shown with the reason that the profile isn't saveable.
  private ifSaveable = (callback: () => void) => {
    let alertText = ''
    if (this.photosSection && this.photosSection.getImageCount() === 0) {
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

  private setupMode = () => this.props.screenProps && this.props.screenProps.setupMode
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    profile: state.profile,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    onChangePreferredNameTextInput: (preferredName: string) => dispatch(onChangePreferredNameTextInput(preferredName)),
    onChangeBioTextInput: (bio: string) => dispatch(onChangeBioTextInput(bio)),
    updatePreferredName: (preferredName: string) => dispatch(updatePreferredName(preferredName)),
    updateBio: (bio: string) => dispatch(updateBio(bio)),
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
    fontSize: 17,
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
  title: {
    fontSize: 14,
    letterSpacing: .8,
  },
  bigInput: {
    fontSize: 20,
  },
  aboutMeTitle: {
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
  },
  react: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactsTitle: {
    marginTop: 20,
    marginBottom: 10,
  },
  reactNum: {
    marginLeft: 4,
    fontSize: 12,
    color: 'rgba(41,41,44,0.76)',
  },
  imageReact: {
      paddingVertical: 15,
      width: 25,
      height: 25,
      justifyContent: 'center',
  },
  underline: {
    textDecorationLine: 'underline',
    textDecorationColor: '#D5DCE2',
  },
  emoji: {
    fontSize: 23,
  },
  saveOverlay: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 20 : 5,
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
