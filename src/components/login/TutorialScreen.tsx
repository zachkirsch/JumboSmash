import React, { PureComponent } from 'react'
import { View, StyleSheet, ScrollView, Image, Dimensions, Alert } from 'react-native'
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
        notificationsPermissed,
      }))
  }

  render() {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} pagingEnabled style={{width, height}}>
        {this.renderTutorialSlides()}
        {this.renderLastSlide()}
      </ScrollView>
    )
  }

  private renderTutorialSlides = () => {
    return TUTORIAL_SLIDES.map((slide, i) => (
      <View key={i} style={styles.slide}>
        <Image resizeMode='stretch' source={slide.image}/>
        <JSText style={styles.title}>{slide.title}</JSText>
        <JSText style={styles.subtitle}>{slide.subtitle}</JSText>
        {i === 0 && <Feather style={styles.chevron} name='chevrons-right' size={40} color='blue' />}
      </View>
    ))
  }

  private renderLastSlide = () => {
    if (this.state.notificationsPermissed) {
      return (
        <View style={styles.slide}>
          <JSButton label="Let's Go" onPress={this.finishTutorial} />
        </View>
      )
    } else {
      return (
        <View style={styles.slide}>
          <JSButton label='Set up Notifications' onPress={this.requestNotificationsPermission} />
        </View>
      )
    }
  }

  private finishTutorial = () => {
    this.props.finishTutorial()
    goToNextRoute(this.props.navigation)
  }

  private requestNotificationsPermission = () => {
    firebase.messaging().requestPermission()
    .then(this.finishTutorial)
    .catch(() =>
      Alert.alert(
        'Notifications are Disabled',
        'If you want notifications for JumboSmash, please enable them in your phone Settings',
        [
          {
            text: 'OK',
            onPress: this.finishTutorial,
          },
        ]
      )
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 17,
    textAlign: 'center',
  },
  chevron: {
    position: 'absolute',
    bottom: 20,
  },
})
