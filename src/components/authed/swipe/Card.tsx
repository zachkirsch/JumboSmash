import React, { PureComponent } from 'react'
import {
  Animated,
  Dimensions,
  View,
  StyleSheet,
  Platform,
  PanResponder,
  PanResponderInstance,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Carousel from './Carousel'
import { JSText } from '../../generic'

interface Props {
  onExpandCard?: () => void
  onContractCard?: () => void
}

interface State {
  expansion: Animated.Value,
  fullyExpanded: boolean
  margin: {
    top: number,
    bottom: number,
  }
  momentumScrolling: boolean
}

type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const TAGS = [
  'Japanese',
  'jobless af',
  'Chinese',
  'has a lot of tags',
  'did porn to pay for tuition',
  'tags mcgee',
  'call me taggart',
  'is this tag good',
  'tag1',
  'tag2',
  'tag3',
  'Japanese',
  'jobless af',
  'Chinese',
  'did porn to pay for tuition',
  'has a lot of tags',
  'tags mcgee',
  'call me taggart',
  'is this tag good',
  'tag1',
  'tag2',
  'tag3',
]

const IMAGES = [
  'https://www.organicheadshots.com/images/headshot116.jpg',
  'https://www.organicheadshots.com/images/headshot121.jpg',
  'https://www.organicheadshots.com/images/headshot04.jpg',
]

class Card extends PureComponent<Props, State> {

  private cardPanResponder: PanResponderInstance
  private mainScrollView: any /* tslint:disable-line:no-any */
  private carousel: Carousel

  constructor(props: Props) {
    super(props)
    this.state = {
      expansion: new Animated.Value(0),
      fullyExpanded: false,
      margin: {
        top: 0,
        bottom: 0,
      },
      momentumScrolling: false,
    }
    this.setupGestureResponders()
  }

  public tap = () => {
    if (!this.state.fullyExpanded) {
      this.expandCard()
    }
  }

  render() {

    const outerContainerStyle = {
      marginTop: this.state.expansion.interpolate({
        inputRange: [0, 1],
        outputRange: [20, this.state.margin.top],
      }),
      marginBottom: this.state.expansion.interpolate({
        inputRange: [0, 1],
        outputRange: [20, this.state.margin.bottom],
      }),
      marginHorizontal: this.state.expansion.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 0],
      }),
    }

    const borderRadiusStyle = {
      borderRadius: this.state.expansion.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 0],
      }),
    }

    return (
      <Animated.View
        style={[styles.outerContainer, outerContainerStyle, borderRadiusStyle]}
      >
        <Animated.View
          style={[styles.innerContainer, borderRadiusStyle]}
          {...this.cardPanResponder.panHandlers}
        >
          <Animated.ScrollView
            scrollEventThrottle={1}
            scrollEnabled={this.state.fullyExpanded}
            onScroll={this.onScrollCard}
            onMomentumScrollBegin={this.onMomentumScrollCard(true)}
            onMomentumScrollEnd={this.onMomentumScrollCard(false)}
            style={[styles.scrollView]}
            showsVerticalScrollIndicator={false}
            ref={(ref: any) => this.mainScrollView = ref} /* tslint:disable-line:no-any */
          >
            <View
              style={styles.card}
            >
              <Carousel
                enabled={this.state.fullyExpanded}
                imageUris={IMAGES}
                ref={(ref) => this.carousel = ref}
              />
              <View
                style={styles.bottomContainer}
              >
                <JSText fontSize={20} bold style={styles.name}>Yuki</JSText>
                <View style={styles.textContainer}>
                  <JSText fontSize={14} style={styles.hash}>{'#'}</JSText>
                  {
                    TAGS.map((tag, i) => {
                      return <JSText fontSize={14} style={styles.tag} key={i}>{tag}</JSText>
                    })
                  }
                  <JSText fontSize={14} style={styles.bio}>
                    This is my bio. It is very long. I am such a long writer. Look at me go!
                    Soon I will have reached a few lines, and then BAM, I'm almost on line 5.
                    Come on, you can do it. You've trained your whole life for this.
                    Don't mess up now... yeah baby!! This is my bio. It is very long.
                    I am such a long writer. Look at me go! Soon I will have reached a few lines, and then BAM,
                    I'm almost on line 5. Come on, you can do it. You've trained your whole life for this.
                    Don't mess up now... yeah baby!!
                  </JSText>
                </View>
              </View>
            </View>
          </Animated.ScrollView>
          {this.renderGradient()}
        </Animated.View>
      </Animated.View>
    )
  }

  private renderGradient = () => {

    const gradientStyle = {
      opacity: this.state.expansion.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1],
      }),
    }

    return (
      <Animated.View
        style={[styles.overlay, gradientStyle]}
      >
        <LinearGradient
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
          start={{x: 0, y: 0}} end={{x: 0, y: 0.5}}
          style={{flex: 1}}
        >
            <View style={{flex: 1}}/>
        </LinearGradient>
      </Animated.View>
    )
  }

  private expandCard = () => {
    this.props.onExpandCard && this.props.onExpandCard()
    this.setState({
      margin: {
        top: 0,
        bottom: 0,
      },
    })
    Animated.timing(
      this.state.expansion,
      {
        toValue: 1,
        duration: 100,
      }
    ).start(() => {
      this.setState({
        fullyExpanded: true,
      })
    })
  }

  private contractCard = () => {
    this.props.onContractCard && this.props.onContractCard()
    this.setState({
      fullyExpanded: false,
    })
    Animated.timing(
      this.state.expansion,
      {
        toValue: 0,
        duration: 100,
      }
    ).start()
  }

  private onMomentumScrollCard = (momentumScrolling: boolean) => {
    return () => {
      this.setState({
        momentumScrolling,
      })
    }
  }

  private onScrollCard = (event: ScrollEvent) => {

    if (this.state.momentumScrolling) {
      return
    }

    const {contentOffset, contentSize, layoutMeasurement} = event.nativeEvent

    const swipedDown = contentOffset.y < -75
    const swipedUp = contentOffset.y + layoutMeasurement.height > contentSize.height + 125
    if (swipedDown) {
      this.setState({
        margin: {
          top: swipedDown ? -contentOffset.y : this.state.margin.top,
          bottom: swipedUp ? contentOffset.y + layoutMeasurement.height - contentSize.height : this.state.margin.bottom,
        },
      })
      this.mainScrollView.getNode().scrollTo({x: 0, y: 0, animated: false})
      this.contractCard()
    }
  }

  private setupGestureResponders = () => {
    this.cardPanResponder = PanResponder.create({

      onStartShouldSetPanResponder: () => {
        return !this.state.fullyExpanded
      },

      onStartShouldSetPanResponderCapture: () => {
        return !this.state.fullyExpanded
      },

      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy === 0 && gestureState.dx === 0) { // just a tap
          this.tap()
        }
      },

    })
  }
}

export default Card

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowRadius: 5,
        shadowOpacity: 0.5,
        shadowOffset: {
          width: 0,
          height: 0,
        },
      },
    }),
    ...Platform.select({
      android: {
        elevation: 3,
      },
    }),
  },
  innerContainer: {
    overflow: 'hidden',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '2%',
    bottom: 0,
    left: 0,
    elevation: 4,
  },
  card: {
    minHeight: '100%',
    flex: 1,
    overflow: 'hidden',
  },
  bottomContainer: {
    padding: 10,
    justifyContent: 'flex-end',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  name: {
    color: 'rgb(66, 64, 64)',
    marginVertical: 10,
  },
  hash: {
    color: '#A8BAD8',
    marginRight: 3,
  },
  tag: {
    color: '#9B9B9B',
    textDecorationLine: 'underline',
    textDecorationColor: '#9B9B9B',
    marginRight: 5,
  },
  bio: {
    marginTop: 15,
    marginBottom: 40,
    color: 'rgb(66, 64, 64)',
  },
})
