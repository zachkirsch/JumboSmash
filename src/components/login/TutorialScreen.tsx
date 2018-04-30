import React, { PureComponent } from 'react'
import { View, StyleSheet, Platform, ScrollView, Image, Dimensions, Alert } from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../redux'
import { finishTutorial } from '../../services/auth'
import { JSText, JSButton } from '../common'
import { goToNextRoute } from '../navigation/LoginRouter'
import { Images } from '../../assets/img'
import Feather from 'react-native-vector-icons/Feather'
import firebase from 'react-native-firebase'

interface StateProps {
  tutorialFinished: boolean
}

interface DispatchProps {
  finishTutorial: () => void
}

type Props = NavigationScreenPropsWithRedux<{}, StateProps & DispatchProps>

interface State {
  notificationsPermissed: boolean
}

const { width, height } = Dimensions.get('window')

const TUTORIAL_SLIDES = [
  {
    image: Images.tutorial_slide_1,
    title: 'CREATE A PROFILE',
    subtitle: 'Put your best foot forward to the rest of the senior class',
  },
  {
    image: Images.tutorial_slide_2,
    title: 'REACT ON FRIENDS',
    subtitle: 'Let your friends know what you think of their profiles',
  },
  {
    image: Images.tutorial_slide_3,
    title: 'MAKE NEW FRIENDS ;)',
    subtitle: 'Swipe right to make your move',
  },
]

class TutorialScreen extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      notificationsPermissed: false,
    }
  }

  componentDidMount() {
    firebase.messaging().hasPermission()
      .then(notificationsPermissed => this.setState({
        notificationsPermissed: !!notificationsPermissed,
      }))
  }

  render() {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        style={styles.scrollView}
      >
        {this.renderTutorialSlides()}
      </ScrollView>
    )
  }

  private renderTutorialSlides = () => {
    return TUTORIAL_SLIDES.map((slide, i) => (
      <View key={Platform.OS === 'android' ? undefined : i} style={styles.slide}>
        <Image resizeMode='stretch' source={slide.image} style={styles.image} />
        <View style={styles.textContainer}>
          <JSText style={styles.title}>{slide.title}</JSText>
          <JSText style={styles.subtitle}>{slide.subtitle}</JSText>
        </View>
        {i === 0 && this.renderChevrons()}
        {i === TUTORIAL_SLIDES.length - 1 && this.renderSmashButton()}
      </View>
    ))
  }

  private renderChevrons = () => (
    <Feather
      style={styles.bottomItem}
      name='chevrons-right'
      size={40}
      color='rgba(172,203,238,0.6)'
    />
  )

  private renderSmashButton = () => {
    return (
      <JSButton label="Let's Go" onPress={this.onPressSmash} containerStyle={styles.bottomItem}/>
    )
  }

  private onPressSmash = () => {
    if (!this.state.notificationsPermissed) {
      this.requestNotificationsPermission()
    } else {
      this.finishTutorial()
    }
  }

  private finishTutorial = () => {
    this.props.finishTutorial()
    goToNextRoute(this.props.navigation)
  }

  private requestNotificationsPermission = () => {
    Alert.alert(
      'Push Notifications',
      'Do you want to receive push notifications when someone matches with you?',
      [
        { text: 'No', onPress: this.finishTutorial },
        {
          text: 'Yes',
          onPress: () => firebase.messaging().requestPermission()
            .then(this.finishTutorial)
            .catch(() =>
              Alert.alert(
                'Notifications are disabled',
                'If you want notifications for JumboSmash, please enable them in the Settings app',
                [
                  {
                    text: 'OK',
                    onPress: this.finishTutorial,
                  },
                ]
              )
            ),
        },
      ],
      { cancelable: false }
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    tutorialFinished: state.auth.tutorialFinished,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    finishTutorial: () => dispatch(finishTutorial()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TutorialScreen)

const styles = StyleSheet.create({
  slide: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  scrollView: {
    width,
    height,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 17,
    textAlign: 'center',
    marginHorizontal: 30,
  },
  bottomItem: {
    position: 'absolute',
    bottom: 60,
  },
  textContainer: {
    marginVertical: 50,
  },
  image: {
  },
})
