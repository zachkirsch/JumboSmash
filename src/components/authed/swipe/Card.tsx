import React, { PureComponent } from 'react'
import {
  Animated,
  Easing,
  View,
  StyleSheet,
  Platform,
  PanResponder,
  PanResponderInstance,
  PanResponderGestureState,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Entypo from 'react-native-vector-icons/Entypo'
import Carousel from './Carousel'
import { clamp } from '../../utils'
import { JSText } from '../../generic'
import { User } from '../../../services/swipe'
import { Direction } from '../../../services/api'

interface Props {
  positionInDeck: number
  profile: User
  previewMode?: boolean
  onCompleteSwipe?: (direction: Direction, onUser: User) => void
  onExpandCard?: () => void
  onContractCard?: () => void
}

export type CardProps = Props

interface State {
  pan: Animated.ValueXY
  panX: Animated.Value
  expansion: Animated.Value
  fullyExpanded: boolean
  margin: {
    top: Animated.Value
    bottom: Animated.Value
  }
  shouldBounce: boolean // scrollView should bounce at the top, but not the bottom
  isMomentumScrolling: boolean
}

type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>

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

const BOTTOM_SWIPE_AWAY_ENABLED = false
const WIDTH = Dimensions.get('window').width
const MAX_MARGIN = 20

class Card extends PureComponent<Props, State> {

  private cardPanResponder: PanResponderInstance
  private mainScrollView: any /* tslint:disable-line:no-any */
  private carousel: Carousel
  private isSwipingProgrammatically: boolean = false
  private isSwiping: boolean = false

  constructor(props: Props) {
    super(props)
    this.state = {
      pan: new Animated.ValueXY(),
      panX: new Animated.Value(0),
      expansion: new Animated.Value(0),
      fullyExpanded: false,
      margin: {
        top: new Animated.Value(MAX_MARGIN),
        bottom: new Animated.Value(MAX_MARGIN),
      },
      shouldBounce: true,
      isMomentumScrolling: false,
    }
    this.setupGestureResponders()
  }

  public tap = () => {
    if (!this.state.fullyExpanded) {
      this.expandCard()
    }
  }

  public expandCard = () => {
    this.props.onExpandCard && this.props.onExpandCard()
    Animated.parallel([
      Animated.timing(
        this.state.expansion,
        {
          toValue: 1,
          duration: 150,
          easing: Easing.inOut(Easing.cubic),
        }
      ),
      Animated.timing(
        this.state.margin.top,
        {
          toValue: 0,
          duration: 150,
        }
      ),
      Animated.timing(
        this.state.margin.bottom,
        {
          toValue: 0,
          duration: 150,
        }
      )]
    ).start()
    this.setState({
      fullyExpanded: true,
    })
  }

  public contractCard = () => {
    this.props.onContractCard && this.props.onContractCard()
    this.setState({
      fullyExpanded: false,
    })
    Animated.parallel([
      Animated.timing(
        this.state.expansion,
        {
          toValue: 0,
          duration: 175,
        }
      ),
      Animated.spring(
        this.state.margin.top,
        {
          toValue: MAX_MARGIN,
          friction: 4,
        }
      ),
      Animated.spring(
        this.state.margin.bottom,
        {
          toValue: MAX_MARGIN,
          friction: 4,
        }
      )]
    ).start()
  }

  public swipeRight = () => {
    this.swipe('right')
  }

  public swipeLeft = () => {
    this.swipe('left')
  }

  render() {
    const outerContainerStyle = {
      zIndex: this.state.fullyExpanded ? 14 : 10 - this.props.positionInDeck,
      marginTop: this.state.margin.top,
      marginBottom: this.state.margin.bottom,
      marginHorizontal: this.state.expansion.interpolate({
        inputRange: [0, 1],
        outputRange: [MAX_MARGIN, 0],
      }),
    }

    const borderRadiusStyle = {
      borderRadius: this.state.expansion.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 0],
      }),
    }

    const scrollViewStyle = {
      backgroundColor: this.state.shouldBounce ? 'transparent' : 'white',
    }

    let shadowStyle
    switch (this.props.positionInDeck) {
      case 0:
        shadowStyle = [
          styles.firstCard,
          Platform.select({
            ios: {
              shadowOpacity: this.state.panX.interpolate({
                inputRange: [-50, 0, 50],
                outputRange: [0.5, 0, 0.5],
              }),
            },
          }),
        ]
        break
      case 1:
        shadowStyle = styles.secondCard
        break
      case 2:
        shadowStyle = styles.thirdCard
        break
    }

    if (this.props.previewMode) {
      shadowStyle = styles.thirdCard
    }

    let [translateX, translateY] = [this.state.pan.x, this.state.pan.y]
    let rotate = this.state.panX.interpolate({inputRange: [-200, 0, 200], outputRange: ['-10deg', '0deg', '10deg']})
    let translationStyle = {transform: [{translateX}, {translateY}, {rotate}]}

    return (
      <Animated.View
        style={[
          styles.outerContainer,
          shadowStyle,
          translationStyle,
          outerContainerStyle,
          borderRadiusStyle,
        ]}
        {...this.cardPanResponder.panHandlers}
      >
        <Animated.View
          style={[styles.innerContainer, borderRadiusStyle]}
        >
            <Animated.ScrollView
              scrollEventThrottle={1}
              scrollEnabled={this.state.fullyExpanded}
              onScroll={this.onScrollCard}
              onMomentumScrollBegin={this.onMomentumScrollCard(true)}
              onMomentumScrollEnd={this.onMomentumScrollCard(false)}
              style={[styles.scrollView, scrollViewStyle]}
              showsVerticalScrollIndicator={false}
              scrollsToTop={false}
              bounces
              ref={(ref: any) => this.mainScrollView = ref} /* tslint:disable-line:no-any */
            >
              <View
                style={styles.card}
              >
                <Carousel
                  enabled={this.state.fullyExpanded}
                  imageUris={this.props.profile.images}
                  onTapImage={this.contractCard}
                  ref={(ref) => this.carousel = ref}
                />
                {this.renderBottom()}
              </View>
              {this.renderExitButton()}
            </Animated.ScrollView>
            {this.renderGradient()}
        </Animated.View>
      </Animated.View>
    )
  }

  private renderBottom = () => {

    const bottomContainerStyle = {
      paddingHorizontal: this.state.expansion.interpolate({
        inputRange: [0, 1],
        outputRange: [10, 10 + MAX_MARGIN],
      }),
    }

    return (
      <Animated.View
        style={[styles.bottomContainer, bottomContainerStyle]}
      >
        <JSText fontSize={20} bold style={styles.name}>{this.props.profile.preferredName}</JSText>
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
      </Animated.View>
    )
  }

  private renderExitButton = () => {
    const containerStyle = {
      opacity: this.state.expansion.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    }

    return (
      <Animated.View style={[styles.exitContainer, containerStyle]}>
        <TouchableOpacity onPress={this.contractCard}>
          <Entypo name='cross' size={40} style={styles.exitIcon} />
        </TouchableOpacity>
      </Animated.View>
    )
  }

  private renderGradient = () => {
    return (
      <View style={styles.overlay}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.6)']}
          start={{x: 0, y: 0}} end={{x: 0, y: 0.5}}
          style={styles.fill}
        >
            <View style={styles.fill} />
        </LinearGradient>
      </View>
    )
  }

  private cardWidth = () => WIDTH - 2 * MAX_MARGIN

  private canSwipe = () => !this.state.fullyExpanded
                           && this.props.positionInDeck === 0
                           && !this.isSwipingProgrammatically

  private isSwipe = (gestureState: PanResponderGestureState) => {
    return Math.abs(gestureState.dx) > 1 || Math.abs(gestureState.dx) > 1
  }

  private getMarginTopFromScrollviewBounce = (event: ScrollEvent) => Math.max(0, -event.nativeEvent.contentOffset.y)

  private getMarginBottomFromScrollviewBounce = (event: ScrollEvent) => {
    const {contentOffset, contentSize, layoutMeasurement} = event.nativeEvent
    return Math.max(0, contentOffset.y + layoutMeasurement.height - contentSize.height)
  }

  private setMarginFromScrollviewBounce = (event: ScrollEvent) => {
    this.state.margin.top.setValue(this.getMarginTopFromScrollviewBounce(event))
    this.state.margin.bottom.setValue(this.getMarginBottomFromScrollviewBounce(event))
  }

  private onMomentumScrollCard = (isMomentumScrolling: boolean) => () => this.setState({isMomentumScrolling})

  private onScrollCard = (event: ScrollEvent) => {

    const {contentOffset, contentSize, layoutMeasurement} = event.nativeEvent

    this.setState({
      shouldBounce: contentOffset.y < (contentSize.height - layoutMeasurement.height) / 2,
    })

    const swipedDown = contentOffset.y < -90
    const swipedUp = contentOffset.y + layoutMeasurement.height > contentSize.height + 100
    if (swipedDown || BOTTOM_SWIPE_AWAY_ENABLED && swipedUp) {
      this.mainScrollView.getNode().scrollTo({x: 0, y: 0, animated: false})
      this.setMarginFromScrollviewBounce(event)
      this.contractCard()
    }
  }

  private swipe = (direction: Direction) => {
    if (!this.canSwipe()) {
      return
    }
    this.isSwipingProgrammatically = true
    let xValue = direction === 'right' ? this.cardWidth() * 2 : this.cardWidth() * -2
    let yValue = 50

    Animated.parallel([
      Animated.timing(
        this.state.pan, {
          toValue: {x: xValue, y: yValue},
          duration: 300,
        }
      ),
      Animated.timing(
        this.state.panX, {
          toValue: xValue,
          duration: 300,
        }
      ),
    ]).start(() => {
      this.isSwipingProgrammatically = false
      this.onCompleteSwipe(direction)
    })
  }

  private onCompleteSwipe = (direction: Direction) => {
    this.props.onCompleteSwipe && this.props.onCompleteSwipe(direction, this.props.profile)
    if (!this.props.previewMode) {
      this.carousel.reset(false)
      this.state.pan.setValue({x: 0, y: 0})
      this.state.panX.setValue(0)
    }
  }

  private setupGestureResponders = () => {

    this.cardPanResponder = PanResponder.create({

      onStartShouldSetPanResponder: () => !this.state.fullyExpanded && this.canSwipe(),
      onStartShouldSetPanResponderCapture: () => !this.state.fullyExpanded && this.canSwipe(),

      onPanResponderMove: (event, gestureState) => {
        if (!this.state.fullyExpanded && this.canSwipe() && this.isSwipe(gestureState)) {
          this.isSwiping = true
          const updatePan = Animated.event([undefined, {dx: this.state.pan.x, dy: this.state.pan.y}])
          const updatePanX = Animated.event([undefined, {dx: this.state.panX}])
          updatePan(event, gestureState)
          updatePanX(event, gestureState)
        }
      },

      onPanResponderRelease: (_, gestureState) => {

        if (!this.canSwipe()) {
          return
        }

        if (!this.isSwiping && !this.isSwipe(gestureState)) { // just a tap
          this.tap()
          return
        }

        this.isSwiping = false

        const {dx, vx, vy} = gestureState

        let isSwipe = Math.abs(dx) > WIDTH / 4
        if (Platform.OS === 'ios') {
          isSwipe = isSwipe && Math.abs(vx) > 0.1 || Math.abs(dx) > 75 && Math.abs(vx) > 0.5
        }

        if (isSwipe) {
          const isRight = dx > 0
          const clampedVx = clamp(vx, 1, 3)
          const clampedVy = clamp(vy, -3, 3)
          const destX = (clampedVx + 0.5) * WIDTH * (isRight ? 1 : -1)
          const destY = (clampedVy - 0.3) * WIDTH
          Animated.parallel([
            Animated.timing(
              this.state.pan, {
                toValue: {
                  x: destX,
                  y: destY,
                },
                duration: 200,
              }
            ),
            Animated.timing(
              this.state.panX, {
                toValue: destX,
                duration: 200,
              }
            ),
          ]).start(() => this.onCompleteSwipe(isRight ? 'right' : 'left'))
        } else {
          Animated.parallel([
            Animated.spring( this.state.pan, {
                toValue: {x: 0, y: 0},
                friction: 4,
              }
            ),
            Animated.spring(
              this.state.panX, {
                toValue: 0,
                friction: 4,
              }
            ),
          ]).start()
        }
      },

    })
  }
}

export default Card

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  outerContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  innerContainer: {
    flex: 1,
    overflow: 'hidden', // so that border radius applies to subviews
  },
  scrollView: {
    flex: 1,
  },
  firstCard: {
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
  secondCard: {
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
        elevation: 2,
      },
    }),
  },
  thirdCard: {
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: {
          width: 0,
          height: 0,
        },
      },
    }),
    ...Platform.select({
      android: {
        elevation: 1,
      },
    }),
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '2%',
    bottom: 0,
    left: 0,
    ...Platform.select({
      android: {
        elevation: 9,
      },
    }),
  },
  card: {
    minHeight: '100%',
    flex: 1,
  },
  bottomContainer: {
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    paddingVertical: 10,
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
  exitContainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 5,
    top: 5,
  },
  exitIcon: {
    color: 'white',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowRadius: 10,
        shadowOffset: {
          width: 0,
          height: 0,
        },
      },
    }),
  },
})
