import React, { PureComponent } from 'react'
import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Switch,
  Platform,
  findNodeHandle,
} from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect, Dispatch } from 'react-redux'
import moment from 'moment'
import { Map } from 'immutable'
import { ActionSheetProps, connectActionSheet } from '@expo/react-native-action-sheet'
import { isSenior } from '../../../utils'
import { flatten } from 'lodash'
import { RootState } from '../../../redux'
import {
  ProfileReact,
  swapImages,
  updateBio,
  updateImage,
  updatePreferredName,
  toggleUnderclassmen,
  Tag,
  ProfileState,
  Event,
} from '../../../services/profile'
import { setTabBarOverlay, clearTabBarOverlay } from '../../../services/navigation'
import { JSText, JSTextInput, JSImage  } from '../../common'
import { User } from '../../../services/swipe'
import PhotosSection from './PhotosSection'
import SettingsSection from './SettingsSection'
import CreditsSection from './CreditsSection'
import TagsSection from './TagsSection'
import SaveOrRevert from './SaveOrRevert'

interface State {
  previewingCard: boolean
  viewingCoC: boolean
  preferredName: string
  bio: string
  seniorGoal: string
  photosSectionRequiresSave: boolean
}

interface OwnProps {}

interface StateProps {
  profile: ProfileState
  allUsers: Map<number, User>
  postRelease2: boolean
}

interface DispatchProps {
  updatePreferredName: (preferredName: string) => void
  updateBio: (bio: string) => void
  updateImage: (index: number, imageUri: string, mime: string) => void
  swapImages: (index1: number, index2: number) => void
  setTabBarOverlay: (component: () => JSX.Element) => void
  clearTabBarOverlay: () => void
  toggleUnderclassmen: (showUnderclassmen: boolean) => void
}

type Props = ActionSheetProps<NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>>

const MAX_SENIOR_GOAL_LENGTH = 200
const MAX_BIO_LENGTH = 1000
const MAX_PREFERRED_NAME_LENGTH = 30

@connectActionSheet
class ProfileScreen extends PureComponent<Props, State> {

  private mainScrollView: any /* tslint:disable-line:no-any */
  private photosSection: PhotosSection | null
  private preferredNameTextInput: JSTextInput | null
  private bioTextInput: JSTextInput | null
  private seniorGoalTextInput: JSTextInput | null
  private saveRequired = false

  constructor(props: Props) {
    super(props)
    this.state = {
      previewingCard: false,
      viewingCoC: false,
      preferredName: props.profile.preferredName.value,
      bio: props.profile.bio.value,
      seniorGoal: props.profile.seniorGoal.value,
      photosSectionRequiresSave: false,
    }
  }

  componentDidMount() {
    this.props.navigation.addListener('didBlur', Keyboard.dismiss)
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
            updateImage={this.updateImage}
            showActionSheetWithOptions={this.props.showActionSheetWithOptions!}
            onChange={this.markPhotosSectionAsRequiringSave}
            ref={ref => this.photosSection = ref}
          />
          {this.renderPersonalInfo()}
          {this.renderTags()}
          {this.renderReacts()}
          {this.renderBucketList()}
          {this.renderSeniorEvents()}
          {this.renderSecondRelease()}
          <SettingsSection
            block={this.navigateTo('BlockScreen')}
            viewCoC={this.navigateTo('ReviewCoCScreen')}
            previewProfile={this.previewProfile()}
            startSmashing={this.setupMode() ? this.save : undefined}
          />
          {this.setupMode() || <CreditsSection />}
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
        type: 'self',
        profile: {
          ...this.props.profile,
          preferredName: this.state.preferredName,
          bio: this.state.bio,
          seniorGoal: this.state.seniorGoal,
          images: this.photosSection!.images().filter(image => !!image),
          tags: this.getSelectedTags(),
        },
      })()

    })
  }

  private getSelectedTags = (): Tag[] => {
    return flatten(
      this.props.profile.tags.value
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
        <TouchableOpacity delayPressIn={100} onPress={this.navigateTo('TagsScreen')}>
          <JSText bold style={[styles.title, styles.tagsTitle]}>TAGS</JSText>
          {toRender}
        </TouchableOpacity>
      </View>
    )
  }
  private renderBucketList = () => {
    let numComplete = 0
    let numToGo = 0
    this.props.profile.bucketList.value.forEach(category => {
      category.items.forEach(item => {
        if (item.completed) {
          numComplete++
        } else {
          numToGo++
        }
      })
    })
    const text = `${numComplete} down, ${numToGo} to go`
    return (
      <View style={styles.personalInfo}>
        <TouchableOpacity
          delayPressIn={100}
          onPress={this.navigateTo('BucketListScreen')}
        >
          <JSText bold style={[styles.title, styles.tagsTitle]}>BUCKET LIST</JSText>
          <JSText style={styles.underline}>{text}</JSText>
        </TouchableOpacity>
      </View>
    )
  }

  private renderSeniorEvents = () => {
    const events = this.props.profile.events.value.filter(e => e.going)
    return (
      <View style={styles.personalInfo}>
        <TouchableOpacity delayPressIn={100} onPress={this.navigateTo('EventsScreen')}>
          <JSText bold style={[styles.title, styles.tagsTitle]}>SENIOR EVENTS</JSText>
          <View style={styles.bigfill}>
            {events.length === 0 ? <JSText>Tap here to RSVP!</JSText> : events.map(this.renderEvent)}
          </View>
        </TouchableOpacity>
      </View>)
  }

  private renderEvent = (event: Event, index: number) => {
    return (
      <View key={index} style={styles.eventRow}>
        <JSText style={styles.eventDate}>{moment(event.time).format('MMM D')}</JSText>
        <JSText style={styles.eventString}>{event.name}</JSText>
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
    for (let i = 0; i < this.props.profile.profileReacts.value.length; i += 2) {
      reactColumns.push(
        <View style={styles.reactColumn} key={i}>
          {this.renderReact(this.props.profile.profileReacts.value[i])}
          {this.renderReact(this.props.profile.profileReacts.value[i + 1])}
        </View>
      )
    }

    return (
      <TouchableOpacity
        style={styles.personalInfo}
        delayPressIn={100}
        onPress={this.navigateToMyReactsScreen}
      >
        <JSText bold style={[styles.title, styles.reactsTitle]}>REACTS RECEIVED</JSText>
        <View style={styles.reactColumns}>
          {reactColumns}
        </View>
      </TouchableOpacity>
    )
  }

  private renderPreferredName = () => (
    <View>
      <JSText bold style={[styles.title, styles.preferredNameTitle]}>NAME</JSText>
      <View style={styles.preferredNameContainer}>
        <JSTextInput
          maxLength={MAX_PREFERRED_NAME_LENGTH}
          style={[styles.bigInput, styles.preferredName]}
          value={this.state.preferredName}
          onChangeText={this.updatePreferredName}
          autoCorrect={false}
          selectTextOnFocus
          onFocus={this.onFocus('preferredName')}
          onSubmitEditing={Keyboard.dismiss}
          returnKeyType='done'
          placeholder='First Name'
          ref={ref => this.preferredNameTextInput = ref}
        />
        <JSText style={[styles.bigInput, styles.lastName]}>
          {this.props.profile.surname}
        </JSText>
      </View>
    </View>
  )

  private renderSeniorGoal = () => {
    return (
      <View style={styles.seniorGoalContainer}>
        <JSText bold style={[styles.title, styles.seniorGoalTitle]}>
          BEFORE I GRADUATE, I'M GOING TO...
        </JSText>
        <JSTextInput
          fancy
          multiline
          maxLength={MAX_SENIOR_GOAL_LENGTH}
          keyboardType='default'
          value={this.state.seniorGoal}
          onChangeText={this.updateSeniorGoal}
          style={styles.bio}
          onFocus={this.onFocus('seniorGoal')}
          ref={ref => this.seniorGoalTextInput = ref}
          placeholder='??'
        />
      </View>
    )
  }

  private renderBio = () => (
    <View style={styles.bioContainer}>
      <JSTextInput
        fancy
        multiline
        maxLength={MAX_BIO_LENGTH}
        keyboardType='default'
        value={this.state.bio}
        onChangeText={this.updateBio}
        style={styles.bio}
        onFocus={this.onFocus('bio')}
        ref={ref => this.bioTextInput = ref}
        placeholder='What does #YOLO mean to you?'
      />
    </View>
  )

  private renderPersonalInfo = () => {
    // bio is first because flexDirection is reverse (so that shadow doesn't cover the bio)
    return (
      <View style={styles.personalInfoContainer}>
        {this.renderSeniorGoal()}
        {this.renderBio()}
        <View style={styles.personalInfo}>
          {this.renderPreferredName()}
          <JSText bold style={[styles.title, styles.aboutMeTitle]}>ABOUT ME</JSText>
        </View>
      </View>
    )
  }

  private renderSecondRelease = () => {
    if (!this.props.postRelease2 || !isSenior(this.props.profile.classYear)) {
      return null
    }
    return (
      <View style={[styles.personalInfo, styles.secondReleaseContainer]}>
        <JSText bold style={[styles.title, styles.secondReleaseTitle]}>
          SHOW ONLY SENIORS
        </JSText>
        <Switch
          onValueChange={this.onToggleUnderclassmenVisibility}
          value={!this.props.profile.showUnderclassmen}
        />
      </View>
    )
  }

  private navigateToMyReactsScreen = () => {
    this.navigateTo('MyReactScreen', {
      allUsers: this.props.allUsers,
      profileReacts: this.props.profile.profileReacts.value,
      whoReacted: this.props.profile.whoReacted,
    })()
  }

  private onToggleUnderclassmenVisibility = (showOnlySeniors: boolean) => {
    this.props.toggleUnderclassmen(!showOnlySeniors)
  }

  private onFocus = (inputName: 'preferredName' | 'bio' | 'seniorGoal') => () => {
    if (Platform.OS !== 'ios') {
      return
    }
    let ref: JSTextInput | null = null
    switch (inputName) {
      case 'preferredName':
        ref = this.preferredNameTextInput
        break
      case 'bio':
        ref = this.bioTextInput
        break
      case 'seniorGoal':
        ref = this.seniorGoalTextInput
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

  private updateImage = (index: number, imageUri: string, mime: string) => {
    const existingPhoto = this.props.profile.images.get(index)
    if (!existingPhoto || existingPhoto.value.uri !== imageUri) {
      this.props.updateImage(index, imageUri, mime)
    }
  }

  private updatePreferredName = (preferredName: string) => {
    if (this.state.preferredName !== preferredName && !this.saveRequired) {
      this.addSaveOverlay()
    }
    this.setState({ preferredName })
  }

  private updateSeniorGoal = (seniorGoal: string) => {
    if (this.state.seniorGoal !== seniorGoal && !this.saveRequired) {
      this.addSaveOverlay()
    }
    this.setState({ seniorGoal })
  }

  private updateBio = (bio: string) => {
    if (this.state.bio !== bio && !this.saveRequired) {
      this.addSaveOverlay()
    }
    this.setState({ bio })
  }

  private addSaveOverlay = () => {
    if (this.setupMode()) {
      return
    }
    if (this.saveRequired) {
      return
    }
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
  }

  private markPhotosSectionAsRequiringSave = () => {
    this.addSaveOverlay()
  }

  private revert = () => {
    const revert = () => {
      this.setState({
        bio: this.props.profile.bio.value,
        preferredName: this.props.profile.preferredName.value,
      })
      this.props.clearTabBarOverlay()
      this.photosSection && this.photosSection.revert()
      this.saveRequired = false
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
        if (this.props.profile.preferredName.value !== this.state.preferredName) {
          this.props.updatePreferredName(this.state.preferredName)
        }
        if (this.props.profile.bio.value !== this.state.bio) {
          this.props.updateBio(this.state.bio)
        }
        this.photosSection && this.photosSection.save()
        this.props.clearTabBarOverlay()
        if (!this.setupMode()) {
          this.saveRequired = false
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

  private setupMode = (): boolean => this.props.screenProps && this.props.screenProps.setupMode
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    profile: state.profile,
    allUsers: state.swipe.allUsers.value,
    postRelease2: state.time.postRelease2,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    updatePreferredName: (preferredName: string) => dispatch(updatePreferredName(preferredName)),
    updateBio: (bio: string) => dispatch(updateBio(bio)),
    updateImage: (index: number, imageUri: string, mime: string) => {
      dispatch(updateImage(index, imageUri, mime))
    },
    swapImages: (index1: number, index2: number) => dispatch(swapImages(index1, index2)),
    setTabBarOverlay: (component: () => JSX.Element) => dispatch(setTabBarOverlay(component)),
    clearTabBarOverlay: () => dispatch(clearTabBarOverlay()),
    toggleUnderclassmen: (showUnderclassmen: boolean) => dispatch(toggleUnderclassmen(showUnderclassmen)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)

const styles = StyleSheet.create({
  seniorGoalContainer: {
    maxHeight: 175,
  },
  bioContainer: {
    maxHeight: 175,
  },
  bio: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 10,
    fontSize: 17,
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
  tagsTitle: {
    marginBottom: 10,
  },
  eventRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    paddingLeft: 10,
  },
  eventDate: {
    fontSize: 13,
    paddingRight: 5,
    color: 'grey',
  },
  eventString: {
    fontSize: 15,
  },
  fill: {
    flex: 1,
    padding: 10,
  },
  bigfill: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgb(249, 250, 253)',
  },
  reactsTitle: {
    alignSelf: 'flex-start',
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
  seniorGoalTitle: {
    margin: 20,
    marginBottom: 5,
  },
  seniorGoal: {
    marginRight: 20,
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
  secondReleaseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondReleaseTitle: {
    marginTop: 10,
  },
})
