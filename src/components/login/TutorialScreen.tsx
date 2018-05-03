import React, { PureComponent } from 'react'
import { View, StyleSheet, Platform, ScrollView, Image, Dimensions, Alert, ScrollEvent } from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../redux'
import { finishTutorial } from '../../services/auth'
import { JSText, JSButton } from '../common'
import { goToNextRoute } from '../navigation/LoginRouter'
import { Images } from '../../assets/img'
import { clamp, getLightColor } from '../../utils'
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
  slideIndex: number
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

  private scrollView: any /* tslint:disable-line:no-any */
  private componentIsMounted = false

  constructor(props: Props) {
    super(props)
    this.state = {
      slideIndex: 0,
      notificationsPermissed: false,
    }
  }

  componentDidMount() {
    this.componentIsMounted = true
    firebase.messaging().hasPermission()
      .then(notificationsPermissed => this.componentIsMounted && this.setState({
        notificationsPermissed: !!notificationsPermissed,
      }))
  }

  componentWillUnmount() {
    this.componentIsMounted = false
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          style={styles.scrollView}
          onScroll={this.onScroll}
          scrollEventThrottle={16}
          ref={ref => this.scrollView = ref}
        >
          {this.renderTutorialSlides()}
        </ScrollView>
        <View style={styles.dotsContainer}>
          {this.renderDots()}
        </View>
    </View>
    )
  }

  private renderTutorialSlides = () => {
    return TUTORIAL_SLIDES.map((slide, i) => (
      <View key={Platform.OS === 'android' ? undefined : i} style={styles.slide}>
        <Image resizeMode='stretch' source={slide.image} />
        <View style={styles.textContainer}>
          <JSText style={styles.title}>{slide.title}</JSText>
          <JSText style={styles.subtitle}>{slide.subtitle}</JSText>
        </View>
        {i === TUTORIAL_SLIDES.length - 1 ? this.renderSmashButton() : this.renderChevrons()}
      </View>
    ))
  }

  private renderChevrons = () => (
    <Feather
      style={styles.bottomItem}
      name='chevrons-right'
      size={40}
      color={getLightColor()}
      onPress={this.onPressChevrons}
    />
  )

  private renderSmashButton = () => {
    return (
      <View style={styles.bottomItem}>
        <JSButton label="Let's Go" onPress={this.onPressSmash} />
      </View>
    )
  }

  private renderDots = () => {
    return TUTORIAL_SLIDES.map((_, i) => {
      const style = [styles.dot, {
        backgroundColor: this.state.slideIndex === i ? 'lightgray' : 'white',
      }]
      return <View key={`dot-${i}`} style={style} />
    })
  }

  private onScroll = (event: ScrollEvent) => {
    const { layoutMeasurement, contentOffset } = event.nativeEvent
    let slideIndex = Math.round(contentOffset.x / layoutMeasurement.width)
    slideIndex = clamp(slideIndex, 0, TUTORIAL_SLIDES.length - 1)
    this.setState({
      slideIndex,
    })
  }

  private onPressChevrons = () => {
    this.scrollView && this.scrollView.scrollTo({
      x: (this.state.slideIndex + 1) * width ,
      animated: true,
    })
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
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    bottom: 0,
    marginBottom: 10,
    width: width,
  },
  dot: {
    borderWidth: 0.5,
    borderColor: 'lightgray',
    marginHorizontal: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
})
