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
import { getMainColor } from '../../../utils'
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
  toggleUnderclassmen,
  Tag,
  ProfileState,
} from '../../../services/profile'
import { LoadableValue } from '../../../services/redux'
import { setTabBarOverlay, clearTabBarOverlay } from '../../../services/navigation'
import { JSText, JSTextInput, JSImage  } from '../../common'
import { isSenior } from '../../../utils'
import PhotosSection from './PhotosSection'
import SettingsSection from './SettingsSection'
import CreditsSection from './CreditsSection'
import TagsSection from './TagsSection'
import SaveOrRevert from './SaveOrRevert'
import Ionicons from 'react-native-vector-icons/Ionicons'

interface BucketList {title: string, items: string[], checked: boolean[]}
interface SeniorEvent {date: string, event: string, attending: boolean, attendees: string[]}
interface SeniorDateEvent {date: string, events: SeniorEvent[]}

interface State {
  previewingCard: boolean
  viewingCoC: boolean
  preferredName: string
  bio: string
  photosSectionRequiresSave: boolean
  SeniorBucketList: BucketList[]
  SeniorEventList: SeniorDateEvent[]
  hasRSVPd: boolean
  hasBucketListItems: boolean
  seniorGoal: string
}

interface OwnProps {}

interface StateProps {
  profile: ProfileState
  postRelease2: boolean
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
  toggleUnderclassmen: (showUnderclassmen: boolean) => void
}

type Props = ActionSheetProps<NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>>

const MAX_BIO_LENGTH = 1000
const MAX_PREFERRED_NAME_LENGTH = 30

@connectActionSheet
class ProfileScreen extends PureComponent<Props, State> {

  seniorGoalTextInput: JSTextInput | null
  private mainScrollView: any /* tslint:disable-line:no-any */
  private photosSection: PhotosSection | null
  private preferredNameTextInput: JSTextInput | null
  private bioTextInput: JSTextInput | null
  private saveRequired = false

  constructor(props: Props) {
    super(props)

    function getInitialValue<T>(item: LoadableValue<T>) {
      if (item.localValue !== undefined) {
        return item.localValue
      } else {
        return item.value
      }
    }

    this.state = {
      previewingCard: false,
      viewingCoC: false,
      preferredName: getInitialValue(props.profile.preferredName),
      bio: getInitialValue(props.profile.bio),
      photosSectionRequiresSave: false,
      seniorGoal: '',
      SeniorBucketList: [{title: 'More Wholesome', items: ['Decorate your graduation cap 🎓',
                          'Facebook message Tony Monaco 💬', 'Paint the Cannon 🎨',
                          'Go on a bar crawl with your (21+) friends 🥂', 'Drink with a professor 🍻',
                          'Smooch a date on the Memorial Steps 💕'],
                          checked: [false, false, false, false, false, false]},
                         {title: 'Less Wholesome', items: ['Relive the Naked / Underwear Quad Run 🍆',
                          'Make eye contact with a freshman year hookup 👀',
                          'Sneak onto the roof of an academic building 🏫',
                          'Smuggle 20 chicken tendies out of Carm using only your wits and your pockets 🍗',
                          'Take a shot at every senior event you attend 🥃',
                          'Hook up in an academic building 😜',
                          'Pretend to not be hungover in front of your parents 😬'],
                          checked: [false, false, false, false, false, false, false]}],

      SeniorEventList: [{date: 'Friday, May 11', events: [{date: 'May 11', event: 'Around the World - SoGo',
                                                          attending: false, attendees: ['Beyonce Knowles', 'Max Bernstein']}]},
                        {date: 'Monday, May 14', events: [{date: 'May 14', event: 'Senior Brunch - Gifford House',
                                                          attending: false, attendees: ['Lord Vader']},
                                                          {date: 'May 14', event: 'Senior Gala - House of Blues',
                                                            attending: false, attendees: ['Winnona DeSombre']}]},
                        {date: 'Tuesday, May 15', events: [{date: 'May 15', event: "Senior Takeover - Dave and Buster's",
                                                            attending: false, attendees: ['Yuki Zaninovich']},
                                                            {date: 'May 15', event: 'Last Night in the Campus Center',
                                                            attending: false, attendees: ['Zach Kirsch', 'Megan Monroe']}]},
                        {date: 'Wednesday, May 16', events: [{date: 'May 16', event: 'Booze Cruise - Boston Harbor',
                                                              attending: false, attendees: ['Chris Gregg', 'Shanshan Duan']},
                                                            {date: 'May 16', event: 'Senior Night - Lucky Strike',
                                                            attending: false, attendees: ["Moe's (RIP)"]}, ]},
                        {date: 'Thursday, May 17', events: [{date: 'May 17', event: 'Senior BBQ - SEC',
                                                            attending: false, attendees: ["Moe's (RIP)", 'Shanshan Duan']},
                                                            {date: 'May 17', event: 'Last Night on the Lawn - Prez Lawn',
                                                            attending: false, attendees: ['Winnona DeSombre', 'Emily Lin']}]},
                        {date: 'Friday, May 18', events: [{date: 'May 18', event: 'Tufts Night at the Pops - Boston Symphony Hall',
                                                          attending: false, attendees: ['Chris Gregory']}]},
                        {date: 'Saturday, May 19', events: [{date: 'May 19', event: 'Baccalaureate Service - Gantcher',
                                                            attending: false, attendees: ['SOMEONE OutOfIdeas']},
                                                            {date: 'May 19', event: 'Candlelight Ceremony - Goddard',
                                                            attending: false, attendees: ["Help it's been 9 hours"]}]},
                        {date: 'Sunday, May 20', events: [{date: 'May 20', event: 'Graduation 🎓',
                                                            attending: false, attendees: ['ugh']}]}],
        hasRSVPd: false,
        hasBucketListItems: false,

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
          {this.renderSeniorGoal()}
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
        <TouchableOpacity onPress={this.navigateTo('TagsScreen')}>
          <JSText bold style={[styles.title, styles.tagsTitle]}>TAGS</JSText>
          {toRender}
        </TouchableOpacity>
      </View>
    )
  }
  private renderBucketList = () => {

    return (
      <View style={styles.personalInfo}>
        <TouchableOpacity
          onPress={this.navigateTo('BucketListScreen', {SeniorBucketList: this.state.SeniorBucketList, newList: this.makeBucketList})}
        >
          <JSText bold style={[styles.title, styles.tagsTitle]}>BUCKET LIST</JSText>
          <View style={styles.fill}>
          {!this.state.hasBucketListItems && this.renderOptions()}
          {this.renderBucketItems(0)}
          {this.renderBucketItems(1)}
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  private makeBucketList = (list: BucketList[]) => {
          this.setState({SeniorBucketList: list})
          this.setState({hasBucketListItems: true})
  }
  private makeList = (list: SeniorDateEvent[]) => {
    this.setState({SeniorEventList: list})
    this.setState({hasRSVPd: true})
  }
  private renderSeniorEvents = () => {
    return (
      <View style={styles.personalInfo}>
        <TouchableOpacity
            onPress={this.navigateTo('SeniorEventScreen', {SeniorEventList: this.state.SeniorEventList, newList: this.makeList})}
        >
          <JSText bold style={[styles.title, styles.tagsTitle]}>SENIOR EVENTS</JSText>
          <View style={styles.bigfill}>
          {!this.state.hasRSVPd && this.renderOptions()}
          {this.renderAllDays()}
          </View>
        </TouchableOpacity>
      </View>)
  }

  private renderAllDays = () => {
    return this.state.SeniorEventList.map((section, sectionIndex) => {
      return (
        <View key={sectionIndex}>
        {this.renderChosenEvents(section.events)}
        </View>
      )
    })
  }
  private renderChosenEvents = (events: SeniorEvent[]) => {
    let chosenEvents: SeniorEvent[]
    chosenEvents = []
    events.map((section) => {
      if (section.attending) {
        chosenEvents.push(section)
      }
    })
    if (chosenEvents.length === 0) {
      return null
    }
      return this.renderChosenRows(chosenEvents)
  }

  private renderChosenRows = (events: SeniorEvent[]) => {
    return events.map((section, sectionIndex) => {
        return (
          <View key={sectionIndex} style={styles.EventRow}>
            <JSText style={styles.eventDate}>{section.date}</JSText>
            <JSText style={styles.eventString}>{section.event}</JSText>
          </View>
      )
    })
  }

  private renderOptions = () => {
      return (<JSText> Click here to view! </JSText>)
  }

  private renderBucketItems = (i: number) => {
     return this.state.SeniorBucketList[i].checked.map((section, sectionIndex) => {
    if (section === true) {
      return (
          <View key={sectionIndex} style={{flexDirection: 'row'}}>
            <Ionicons name='md-checkmark' style={{flex: 1, paddingLeft: 10}} size={30} color={getMainColor()} />
            <JSText style={{flex: 7, paddingTop: 10}}>{this.state.SeniorBucketList[i].items[sectionIndex]}</JSText>
            </View>
      )
    } return null

  })}

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
      <View style={styles.personalInfo}>
       <TouchableOpacity onPress={this.navigateTo('MyReactScreen', {profileReacts: this.props.profile})}>
        <JSText bold style={[styles.title, styles.reactsTitle]}>REACTS RECEIVED</JSText></TouchableOpacity>
         <TouchableOpacity onPress={this.navigateTo('MyReactScreen', {profile: this.props.profile})} style={styles.reactColumns}>
        <View style={styles.reactColumns}>
          {reactColumns}
        </View>
        </TouchableOpacity>
      </View>
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
      <View style={styles.personalInfo}>
        <JSText bold style={[styles.title, styles.preferredNameTitle]}>BEFORE GRADUATION, I'M GOING TO...</JSText>
        <View style={styles.preferredNameContainer}>
          <JSTextInput
            maxLength={50}
            style={[styles.bigInput, styles.preferredName]}
            value={this.state.seniorGoal}
            onChangeText={this.updateSeniorGoal}
            autoCorrect={false}
            selectTextOnFocus
            onFocus={this.onFocus('seniorGoal')}
            onSubmitEditing={Keyboard.dismiss}
            returnKeyType='done'
            ref={ref => this.preferredNameTextInput = ref}
          />
        </View>
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
        autoCorrect={false}
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

  private onToggleUnderclassmenVisibility = (showOnlySeniors: boolean) => {
    this.props.toggleUnderclassmen(!showOnlySeniors)
  }

  private onFocus = (inputName: 'preferredName' | 'bio') => () => {
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
    if (this.state.preferredName !== preferredName) {
      this.addSaveOverlay()
      this.setState({ preferredName })
      this.props.onChangePreferredNameTextInput(preferredName)
    }
  }

  private updateSeniorGoal = (seniorGoal: string) => {
    if (this.state.seniorGoal !== seniorGoal) {
      this.addSaveOverlay()
      this.setState({ seniorGoal })
      this.props.onChangeSeniorGoalTextInput(seniorGoal)
    }
  }

  private updateBio = (bio: string) => {
    if (this.state.bio !== bio && !this.saveRequired) {
      this.addSaveOverlay()
    }
    this.setState({ bio })
    this.props.onChangeBioTextInput(bio)
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
    postRelease2: state.time.postRelease2,
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
    toggleUnderclassmen: (showUnderclassmen: boolean) => dispatch(toggleUnderclassmen(showUnderclassmen)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)

const styles = StyleSheet.create({
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
  EventRow: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 10,
    padding: 5,
  },
  eventDate: {
    flex: 1,
    fontSize: 13,
    paddingTop: 1,
    color: 'grey',
  },
  eventString: {
    flex: 6,
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
