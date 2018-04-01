import React, { PureComponent } from 'react'
import {
  Animated,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PanResponder,
  PanResponderGestureState,
  PanResponderInstance,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Entypo from 'react-native-vector-icons/Entypo'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import { Direction } from '../../../services/api'
import { User } from '../../../services/swipe'
import { JSText } from '../../common'
import { clamp } from '../../../utils'
import TagsSection from '../profile/TagsSection'
import Carousel from './Carousel'

type Props = {
  loading?: boolean
  positionInStack?: number
  profile?: User
  previewMode?: boolean
  onCompleteSwipe?: (direction: Direction, onUser: User) => void
  onExpandCard?: () => void
  onExitExpandedView?: () => void
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
  scrollViewBackgroundColor: string
  isMomentumScrolling: boolean
}

type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
const MAX_VERTICAL_MARGIN = WIDTH / 12
const MAX_HORIZONTAL_MARGIN = WIDTH / 15

class Card extends PureComponent<Props, State> {

  private cardPanResponder: PanResponderInstance
  private mainScrollView: any /* tslint:disable-line:no-any */
  private carousel: Carousel
  private isSwipingProgrammatically: boolean = false
  private isSwiping: boolean = false
  private shimmerRows: ShimmerPlaceHolder[] = []

  constructor(props: Props) {
    super(props)
    this.state = this.getInitialState()
    this.setupGestureResponders()
  }

  componentDidMount() {
    // run shimmers together
    if (this.props.loading) {
      const threeRowAnimated = Animated.parallel(
        this.shimmerRows.map(row => {
          if (row && row.getAnimated) {
            return row.getAnimated()
          }
          return null /* tslint:disable-line:no-null-keyword */
        }),
        {
          stopTogether: false,
        }
      )
      Animated.loop(threeRowAnimated).start()
    }
  }

  public tap = () => {
    if (!this.canTapOrSwipe()) {
      return
    } else if (this.state.fullyExpanded) {
      this.contractCard(true)
    } else {
      this.expandCard()
    }
  }

  public expandCard = () => {
    this.props.onExpandCard && this.props.onExpandCard()
    Animated.parallel([
      Animated.timing(this.state.expansion, { toValue: 1, duration: 100 }),
      Animated.timing(this.state.margin.top, { toValue: 0, duration: 100 }),
      Animated.timing(this.state.margin.bottom, { toValue: 0, duration: 100 }),
    ]).start(() => {
      this.setState({
        fullyExpanded: true,
      })
    })
  }

  public contractCard = (fast: boolean) => {
    this.props.onExitExpandedView && this.props.onExitExpandedView()
    if (this.props.previewMode) {
      return
    }
    this.setState({
      fullyExpanded: false,
    })

    let animations = [
      Animated.timing(this.state.expansion, { toValue: 0, duration: fast ? 100 : 175 }),
    ]
    if (fast) {
      animations = animations.concat([
        Animated.timing(this.state.margin.top,    { toValue: MAX_VERTICAL_MARGIN, duration: 100 } ),
        Animated.timing(this.state.margin.bottom, { toValue: MAX_VERTICAL_MARGIN, duration: 100 } ),
      ])
    } else {
      animations = animations.concat([
        Animated.spring(this.state.margin.top, { toValue: MAX_VERTICAL_MARGIN, friction: 4 } ),
        Animated.spring(this.state.margin.bottom, { toValue: MAX_VERTICAL_MARGIN, friction: 4 } ),
      ])
    }
    this.carousel.reset(false)
    Animated.parallel(animations).start()
  }

  public swipeRight = () => {
    this.swipe('right')
  }

  public swipeLeft = () => {
    this.swipe('left')
  }

  render() {
    const outerContainerStyle = {
      zIndex: this.state.fullyExpanded ? 14 : 10 - this.props.positionInStack,
      marginTop: this.state.margin.top,
      marginBottom: this.state.margin.bottom,
      marginHorizontal: this.state.expansion.interpolate({
        inputRange: [0, 1],
        outputRange: [MAX_HORIZONTAL_MARGIN, 0],
      }),
    }

    const borderRadiusStyle = {
      borderRadius: this.state.expansion.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 0],
      }),
    }

    const scrollViewStyle = {
      backgroundColor: this.state.scrollViewBackgroundColor,
    }

    let shadowStyle
    switch (this.props.positionInStack) {
      case 0:
        shadowStyle = [
          styles.firstCard,
          Platform.select({
            ios: {
              shadowOpacity: this.state.panX.interpolate({
                inputRange: [-1000, -5, 0, 5, 1000],
                outputRange: [0.25, 0.25, 0, 0.25, 0.25],
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

    if (this.props.previewMode || this.props.loading) {
      shadowStyle = styles.secondCard
    }

    const [translateX, translateY] = [this.state.pan.x, this.state.pan.y]
    const rotate = this.state.panX.interpolate({inputRange: [-200, 0, 200], outputRange: ['-10deg', '0deg', '10deg']})
    const translationStyle = {transform: [{translateX}, {translateY}, {rotate}]}

    const outerContainerStyleList = [
      styles.outerContainer,
      shadowStyle,
      translationStyle,
      outerContainerStyle,
      borderRadiusStyle,
    ]

    return (
      <Animated.View style={outerContainerStyleList} {...this.cardPanResponder.panHandlers}>
        <Animated.View style={[styles.innerContainer, borderRadiusStyle]}>
          <Animated.ScrollView
            scrollEventThrottle={1}
            scrollEnabled={this.state.fullyExpanded}
            onScroll={this.onScrollCard}
            onMomentumScrollBegin={this.onMomentumScrollCard(true)}
            onMomentumScrollEnd={this.onMomentumScrollCard(false)}
            style={[styles.scrollView, scrollViewStyle]}
            showsVerticalScrollIndicator={false}
            scrollsToTop={false}
            bounces={this.state.fullyExpanded}
            ref={(ref: any) => this.mainScrollView = ref} /* tslint:disable-line:no-any */
          >
            {this.renderCard()}
            {this.renderExitButton()}
          </Animated.ScrollView>
          {this.renderGradient()}
        </Animated.View>
      </Animated.View>
    )
  }

  private renderCard = () => {

    const imageContainerStyle = {
      height: this.state.expansion.interpolate({
        inputRange: [0, 1],
        outputRange: [WIDTH - 2 * MAX_HORIZONTAL_MARGIN, WIDTH],
      }),
      width: this.state.expansion.interpolate({
        inputRange: [0, 1],
        outputRange: [WIDTH - 2 * MAX_HORIZONTAL_MARGIN, WIDTH],
      }),
    }

    if (this.props.loading) {

      const tagPlaceholders = []
      for (let i = 0; i < 5; i++) {
        tagPlaceholders.push((
          <ShimmerPlaceHolder
            ref={ref => this.shimmerRows.push(ref)}
            key={i}
            duration={1000}
            height={15}
            width={'100%'}
            style={styles.tagPlaceholder}
          />
        ))
      }

      return (
        <View style={styles.card}>
          <View style={styles.imagePlaceholder} />
          <View style={styles.bottomContainer}>
            <ShimmerPlaceHolder
              ref={ref => this.shimmerRows.push(ref)}
              duration={1000}
              height={20}
              style={styles.namePlaceholder}
            />
            {tagPlaceholders}
          </View>
        </View>
      )
    } else {
      return (
        <View style={styles.card}>
          <Carousel
            enabled={this.state.fullyExpanded}
            imageUris={this.props.profile.images.filter(image => image)}
            onTapImage={this.tap}
            imageContainerStyle={imageContainerStyle}
            ref={(ref) => this.carousel = ref}
          />
          {this.renderCardBottom()}
        </View>
      )
    }
  }

  private renderCardBottom = () => {

    return (
      <TouchableWithoutFeedback onPress={this.tap}>
        <View style={styles.bottomContainer}>
          <JSText fontSize={20} bold style={styles.name}>
            {this.props.profile.preferredName}
          </JSText>
          <View style={styles.textContainer}>
            <TagsSection tags={this.props.profile.tags} tagStyle={styles.tag} alignLeft />
          </View>
          <JSText fontSize={14} style={styles.bio}>
            {this.props.profile.bio}
          </JSText>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  private renderExitButton = () => {
    const containerStyle = {
      opacity: this.state.fullyExpanded ? 1 : 0,
    }

    return (
      <View style={[styles.exitContainer, containerStyle]}>
        <TouchableOpacity onPress={this.exitExpandedCard}>
          <Entypo name='cross' size={40} style={styles.exitIcon} />
        </TouchableOpacity>
      </View>
    )
  }

  private renderGradient = () => {
    const gradientStyle = {
      height: this.state.expansion.interpolate({
        inputRange: [0, 1],
        outputRange: ['10%', '3%'],
      }),
    }

    return (
      <Animated.View pointerEvents='none' style={[styles.overlay, gradientStyle]}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={styles.fill}
        >
            <View style={styles.fill} />
        </LinearGradient>
      </Animated.View>
    )
  }

  private cardWidth = () => WIDTH - 2 * MAX_HORIZONTAL_MARGIN

  private canSwipe = () => this.canTapOrSwipe()
                           && !this.state.fullyExpanded
                           && this.props.positionInStack === 0
                           && !this.isSwipingProgrammatically

  private canTapOrSwipe = () => !this.props.loading && !this.props.previewMode

  private isSwipe = (gestureState: PanResponderGestureState) => {
    return Math.abs(gestureState.dx) > 1 || Math.abs(gestureState.dy) > 1
  }

  private getMarginTopFromScrollviewBounce = (event: ScrollEvent) => Math.max(0, -event.nativeEvent.contentOffset.y)

  private getMarginBottomFromScrollviewBounce = (event: ScrollEvent) => {
    const {contentOffset, contentSize, layoutMeasurement} = event.nativeEvent
    return Math.max(0, contentOffset.y + layoutMeasurement.height - contentSize.height)
  }

  private setMarginFromScrollViewBounce = (event: ScrollEvent) => {
    this.state.margin.top.setValue(this.getMarginTopFromScrollviewBounce(event))
    this.state.margin.bottom.setValue(this.getMarginBottomFromScrollviewBounce(event))
  }

  private onMomentumScrollCard = (isMomentumScrolling: boolean) => () => this.setState({isMomentumScrolling})

  private onScrollCard = (event: ScrollEvent) => {

    /* if the user is scrolling the card and is closer to the top,
     * then the background of the ScrollView should be transparent so that
     * when the user scrolls past the top of the card, the background (the
     * other cards) are visible. Otherwise, the background should be white,
     * since we don't want anything shown in the background when the user
     * scrolls past the bottom. This only applies to IOS since ScrollViews
     * don't bounce on Android.
     */

    if (Platform.OS !== 'ios' || !this.canTapOrSwipe()) {
     return
    }

    const {contentOffset, contentSize, layoutMeasurement} = event.nativeEvent

    let closerToTop: boolean
    if (contentSize.height < HEIGHT) {
      closerToTop = contentOffset.y <= 0
    } else {
      closerToTop = contentOffset.y < (contentSize.height - layoutMeasurement.height) / 2
    }
    this.setState({
      scrollViewBackgroundColor: closerToTop ? 'transparent' : 'white',
    })

    /* if the user has pulled the card down enough, then contract the card */
    const pulledDownEnough = contentOffset.y < -90
    if (pulledDownEnough) {
      this.setMarginFromScrollViewBounce(event)
      this.contractCard(false)
    }
  }

  private exitExpandedCard = () => {
    if (this.state.fullyExpanded) {
      this.mainScrollView.getNode().scrollTo({x: 0, y: 0, animated: false})
      this.contractCard(true)
    }

  }

  private swipe = (direction: Direction) => {
    if (!this.canSwipe()) {
      return
    }
    this.isSwipingProgrammatically = true
    const xValue = this.cardWidth() * 2 * (direction === 'right' ? 1 : -1)
    const yValue = 50

    Animated.parallel([
      Animated.timing(this.state.pan, { toValue: {x: xValue, y: yValue}, duration: 300 }),
      Animated.timing(this.state.panX, { toValue: xValue, duration: 300 }),
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

      onStartShouldSetPanResponder: () => this.canSwipe(),
      onStartShouldSetPanResponderCapture: () => this.canSwipe(),

      onPanResponderMove: (event, gestureState) => {
        if (this.canSwipe() && this.isSwipe(gestureState)) {
          this.isSwiping = true
          Animated.event([undefined, {dx: this.state.pan.x, dy: this.state.pan.y}])(event, gestureState)
          Animated.event([undefined, {dx: this.state.panX}])(event, gestureState)
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
            Animated.timing(this.state.pan, { toValue: { x: destX, y: destY, }, duration: 200 }),
            Animated.timing(this.state.panX, { toValue: destX, duration: 200 }),
          ]).start(() => this.onCompleteSwipe(isRight ? 'right' : 'left'))
        } else {
          // spring card back
          Animated.parallel([
            Animated.spring(this.state.pan, { toValue: { x: 0, y: 0 }, friction: 4 }),
            Animated.spring(this.state.panX, { toValue: 0, friction: 4 }),
          ]).start()
        }
      },
    })
  }

  private getInitialState = (): State => ({
      pan: new Animated.ValueXY(),
      panX: new Animated.Value(0),
      expansion: new Animated.Value(this.props.previewMode ? 1 : 0),
      fullyExpanded: !!this.props.previewMode,
      margin: {
        top: new Animated.Value(this.props.previewMode ? 0 : MAX_VERTICAL_MARGIN),
        bottom: new Animated.Value(this.props.previewMode ? 0 : MAX_VERTICAL_MARGIN),
      },
      scrollViewBackgroundColor: 'transparent',
      isMomentumScrolling: false,
  })
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
        shadowOpacity: 0.1,
      },
    }),
    ...Platform.select({
      android: {
        elevation: 2,
      },
    }),
  },
  thirdCard: {
  },
  overlay: {
    position: 'absolute',
    width: '100%',
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
    backgroundColor: 'white',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 20,
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
  imagePlaceholder: {
    backgroundColor: 'rgb(240, 240, 240)',
    height: WIDTH - 2 * MAX_HORIZONTAL_MARGIN,
    width: WIDTH - 2 * MAX_HORIZONTAL_MARGIN,
  },
  namePlaceholder: {
    marginTop: 12,
    marginBottom: 17,
  },
  tagPlaceholder: {
    marginBottom: 5,
  },
})
