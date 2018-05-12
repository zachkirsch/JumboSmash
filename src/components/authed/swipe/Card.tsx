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
  ViewStyle,
  Image,
  BackHandler,
} from 'react-native'
import { ActionSheetOptions } from '@expo/react-native-action-sheet'
import LinearGradient from 'react-native-linear-gradient'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import { Direction } from '../../../services/api'
import { User } from '../../../services/swipe'
import { ProfileReact } from '../../../services/profile'
import { JSText, ReactSection } from '../../common'
import { clamp, generateActionSheetOptions, reportUser } from '../../../utils'
import TagsSection from '../profile/TagsSection'
import Carousel from './Carousel'
import { Images } from '../../../assets'

interface BaseProps {
  containerStyle?: ViewStyle
  cardContainerStyle?: ViewStyle
}

interface LoadingProps extends BaseProps {
  type: 'loading'
}

interface ProfileBasedProps extends BaseProps {
  profile: User
  showClassYear: boolean
  react: (reacts: ProfileReact[], onUser: number) => void
}

interface PreviewProps extends ProfileBasedProps {
  type: 'preview'
  exit: () => void
  reactsEnabled: boolean
}

interface NormalProps extends ProfileBasedProps {
  type: 'normal'
  positionInStack: number
  showActionSheetWithOptions: (options: ActionSheetOptions, onPress: (buttonIndex: number) => void) => void,
  onCompleteSwipe?: (direction: Direction, onUser: number, wasBlock: boolean) => void
  block: (userId: number, email: string) => void
  onExpandCard?: () => void
  onExitExpandedView?: () => void
}

type Props = PreviewProps | LoadingProps | NormalProps

export type CardProps = Props

interface State {
  pan: Animated.ValueXY
  panX: Animated.Value
  expansion: Animated.Value
  fullyExpanded: boolean
  fullyContracted: boolean
  margin: {
    top: Animated.Value
    bottom: Animated.Value
    horizontal: Animated.Value
  }
  easedIn: boolean
  scrollViewBackgroundColor: string
  isMomentumScrolling: boolean
}

type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
const VERTICAL_MARGIN = WIDTH / 12
const HORIZONTAL_MARGIN = WIDTH / 15
const BOTTOM_CONTAINER_HORIZONTAL_PADDING = 20
const BORDER_RADIUS = Platform.select({ ios: 20, android: 30 })

class Card extends PureComponent<Props, State> {

  private cardPanResponder: PanResponderInstance
  private mainScrollView: any /* tslint:disable-line:no-any */
  private carousel: Carousel | null
  private reactSection: ReactSection | null
  private isSwipingProgrammatically: boolean = false
  private isSwiping: boolean = false
  private didSwipe: boolean = false
  private shimmerRows: ShimmerPlaceHolder[] = []
  private componentIsMounted = false

  constructor(props: Props) {
    super(props)
    this.state = this.getInitialState()
    this.setupGestureResponders()
  }

  componentDidMount() {

    BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.state.fullyExpanded) {
        this.contractCard(true)
        return true
      }
      return false
    })

    this.componentIsMounted = true
    // run shimmers together
    if (this.props.type === 'loading') {
      const threeRowAnimated = Animated.parallel(
        this.shimmerRows
          .filter(row => row && row.getAnimated)
          .map(row => row.getAnimated!()),
        {
          stopTogether: false,
        }
      )
      Animated.loop(threeRowAnimated).start()
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => {}) /* tslint:disable-line:no-empty */
    this.componentIsMounted = false
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.type === 'normal' && nextProps.type === 'normal') {
      if (this.props.positionInStack !== nextProps.positionInStack) {
        Animated.parallel([
          Animated.timing(
            this.state.margin.top,
            {
              toValue: this.getContractedMarginTop(nextProps.positionInStack),
              duration: 300,
            }
          ),
          Animated.timing(
            this.state.margin.horizontal,
            {
              toValue: this.getContractedMarginHorizontal(nextProps.positionInStack),
              duration: 300,
            }
          ),
        ]).start(() => {
          this.safeSetState({
            easedIn: nextProps.positionInStack === 0,
          })
        })
      }
    }
  }

  public tap = () => {
    if (this.props.type !== 'normal') {
      return
    } else if (this.state.fullyExpanded) {
      this.exitExpandedCard()
    } else {
      this.expandCard()
    }
  }

  public expandCard = () => {
    if (this.props.type !== 'normal') {
      return
    }
    this.safeSetState({
      fullyContracted: false,
    }, () => {
      if (this.props.type !== 'normal') {
        return
      }
      this.props.onExpandCard && this.props.onExpandCard()
      Animated.parallel([
        Animated.timing(this.state.expansion, { toValue: 1, duration: 100 }),
        Animated.timing(this.state.margin.top, { toValue: 0, duration: 100 }),
        Animated.timing(this.state.margin.bottom, { toValue: 0, duration: 100 }),
        Animated.timing(this.state.margin.horizontal, { toValue: 0, duration: 100 }),
      ]).start(() => {
        this.safeSetState({
          fullyExpanded: true,
          easedIn: true,
        })
      })
    })
  }

  public contractCard = (fast: boolean) => {

    if (this.props.type !== 'normal') {
      return
    }

    this.props.onExitExpandedView && this.props.onExitExpandedView()
    this.safeSetState({
      fullyExpanded: false,
    }, () => {
      let animations = [
        Animated.timing(this.state.expansion, { toValue: 0, duration: fast ? 100 : 175 }),
      ]
      if (fast) {
        animations = animations.concat([
          Animated.timing(this.state.margin.top,    { toValue: VERTICAL_MARGIN, duration: 100 } ),
          Animated.timing(this.state.margin.bottom, { toValue: VERTICAL_MARGIN, duration: 100 } ),
          Animated.timing(this.state.margin.horizontal, { toValue: HORIZONTAL_MARGIN, duration: 100 } ),
        ])
      } else {
        animations = animations.concat([
          Animated.spring(this.state.margin.top, { toValue: VERTICAL_MARGIN, friction: 4 } ),
          Animated.spring(this.state.margin.bottom, { toValue: VERTICAL_MARGIN, friction: 4 } ),
          Animated.spring(this.state.margin.horizontal, { toValue: HORIZONTAL_MARGIN, friction: 4 } ),
        ])
      }
      this.carousel && this.carousel.reset(false)
      Animated.parallel(animations).start()
      this.safeSetState({
        fullyContracted: true,
      })
    })
  }

  public swipeRight = () => {
    if (this.canSwipeProgrammatically()) {
      this.swipe('right')
    }
  }

  public swipeLeft = () => {
    if (this.canSwipeProgrammatically()) {
      this.swipe('left')
    }
  }

  render() {

    let positionInStack = 1
    if (this.props.type === 'normal') {
      positionInStack = this.props.positionInStack
    }

    const outerContainerStyle = {
      zIndex: this.state.fullyExpanded ? 10 - positionInStack : 10 - positionInStack,
      marginTop: this.state.margin.top,
      marginBottom: this.state.margin.bottom,
      marginHorizontal: this.state.margin.horizontal,
    }

    const borderRadiusStyle = Platform.select({
      ios: {
        borderRadius: this.state.expansion.interpolate({
          inputRange: [0, 1],
          outputRange: [BORDER_RADIUS, 0],
        }),
      },
      android: {
        borderRadius: 0,
      },
    })

    const scrollViewStyle = {
      backgroundColor: this.state.scrollViewBackgroundColor,
    }

    let shadowStyle
    switch (positionInStack) {
      case 0:
        shadowStyle = styles.firstCard
        break
      case 1:
        shadowStyle = styles.secondCard
        break
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
      this.props.containerStyle,
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
            {this.renderEllipsisMenu()}
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
        outputRange: [WIDTH - 2 * HORIZONTAL_MARGIN, WIDTH],
      }),
      width: this.state.expansion.interpolate({
        inputRange: [0, 1],
        outputRange: [WIDTH - 2 * HORIZONTAL_MARGIN, WIDTH],
      }),
    }

    const cardContainerStyle = [styles.card, this.props.cardContainerStyle]

    if (this.props.type === 'loading') {
      const tagPlaceholders = []
      for (let i = 0; i < 5; i++) {
        tagPlaceholders.push((
          <ShimmerPlaceHolder
            ref={ref => this.shimmerRows.push(ref!)}
            key={i}
            duration={1000}
            height={15}
            width={'100%'}
            style={styles.tagPlaceholder}
          />
        ))
      }

      return (
        <Animated.View style={cardContainerStyle}>
          <View style={styles.imagePlaceholder} />
          <View style={styles.bottomContainer}>
            <ShimmerPlaceHolder
              ref={ref => this.shimmerRows.push(ref!)}
              duration={1000}
              height={20}
              style={styles.namePlaceholder}
            />
            {tagPlaceholders}
          </View>
        </Animated.View>
      )
    } else {
      return (
        <Animated.View style={cardContainerStyle}>
          <Carousel
            enabled={this.state.fullyExpanded}
            imageUris={this.props.profile.images.filter(image => image)}
            onTapImage={this.tap}
            imageContainerStyle={imageContainerStyle}
            ref={ref => this.carousel = ref}
          />
          {this.renderCardBottom()}
        </Animated.View>
      )
    }
  }

  private renderCardBottom = () => {

    if (this.props.type === 'loading') {
      return null
    }

    const hiddenWhenExpandedStyle = [
      {
        opacity: this.state.expansion.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0],
        }),
      },
    ]

    const hiddenWhenContractedStyle = [
      {
        opacity: this.state.expansion,
      },
    ]

    let paddingHorizontal
    if (this.state.easedIn) {
      paddingHorizontal = BOTTOM_CONTAINER_HORIZONTAL_PADDING
    } else {
      paddingHorizontal = Animated.add(HORIZONTAL_MARGIN + BOTTOM_CONTAINER_HORIZONTAL_PADDING,
                                       Animated.multiply(-1, this.state.margin.horizontal))
    }

    const bottomContainerStyle = [
      styles.bottomContainer,
      { paddingHorizontal },
    ]

    let surnameWhenExpaned = this.props.profile.surname
    if (this.props.showClassYear) {
      surnameWhenExpaned += ` '${this.props.profile.classYear % 100}`
    }

    return (
      <TouchableWithoutFeedback onPress={this.tap}>
        <Animated.View style={bottomContainerStyle}>
          <View style={styles.fullName}>
            <JSText bold style={styles.name}>
              {this.props.profile.preferredName}
            </JSText>
            <View style={{flex: 1}}>
              <Animated.View style={[hiddenWhenContractedStyle, StyleSheet.absoluteFill]}>
                <JSText style={styles.name} numberOfLines={1}>
                  {surnameWhenExpaned}
                </JSText>
              </Animated.View>
              <Animated.View style={[hiddenWhenExpandedStyle, StyleSheet.absoluteFill]}>
                {this.renderClassYear()}
              </Animated.View>
            </View>
          </View>
          {this.renderTags()}
          <Animated.View style={hiddenWhenContractedStyle}>
            <View style={styles.profileText}>
              <JSText style={styles.bio}>
                {this.props.profile.bio}
              </JSText>
              {this.renderSeniorGoal()}
            </View>
            {this.renderReactSection()}
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }

  private renderSeniorGoal = () => {
    if (this.props.type === 'loading') {
      return null
    }
    if (!this.props.profile.seniorGoal) {
      return null
    }
    return (
      <View style={styles.seniorGoalContainer}>
        <JSText style={styles.seniorGoalText} semibold>
          Before I graduate, I'm going to...
        </JSText>
        <JSText style={styles.seniorGoalText}>
          {this.props.profile.seniorGoal}
        </JSText>
      </View>
    )
  }

  private renderReactSection = () => {
    if (this.props.type === 'loading') {
      return null
    }
    return (
      <ReactSection
        reacts={this.props.profile.profileReacts.value}
        onPressReact={this.onPressReact}
        enabled={this.props.type === 'normal' || this.props.reactsEnabled}
        ref={ref => this.reactSection = ref}
      />
    )
  }

  private renderTags = () => {
    if (this.props.type === 'loading') {
      return null
    }
    if (this.props.profile.tags.length === 0) {
      return null
    }
    return (
      <View style={styles.tagsContainer}>
        <View style={styles.hashContainer}>
          <Image source={Images.hash} style={styles.hash} resizeMode='contain' />
        </View>
        <View style={styles.tagsSectionContainer} >
          <TagsSection
            tags={this.props.profile.tags}
            tagStyle={styles.tag}
            emojiStyle={styles.emoji}
          />
        </View>
      </View>
    )
  }

  private renderClassYear = () => {

    if (this.props.type === 'loading' || !this.props.showClassYear) {
      return null
    }

    let colors = []
    switch (this.props.profile.classYear) {
      case 2018:
        colors = ['rgb(202, 183, 207)', 'rgb(211, 217, 245)']
        break
      case 2019:
        colors = ['rgb(222, 201, 221)', 'rgb(235, 197, 198)']
        break
      case 2020:
        colors = ['rgb(254, 224, 204)', 'rgb(252, 197, 180)']
        break
      case 2021:
        colors = ['rgb(220, 214, 235)', 'rgb(241, 230, 233)']
        break
      default:
        return null
    }

    return (
      <LinearGradient
        colors={colors}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        style={styles.classYearContainer}
      >
        <JSText bold style={styles.classYearText}>
          {this.props.profile.classYear}
        </JSText>
      </LinearGradient>
    )
  }

  private renderExitButton = () => {

    const containerStyle = [
      {
        opacity: this.state.expansion,
      },
    ]

    return (
      <Animated.View style={[styles.exitContainer, containerStyle]}>
        <TouchableOpacity onPress={this.exitExpandedCard}>
          <Image style={styles.exitIcon} resizeMode='contain' source={Images.exit} />
        </TouchableOpacity>
      </Animated.View>
    )
  }

  private renderEllipsisMenu = () => {
    if (!this.state.fullyExpanded || this.props.type !== 'normal') {
      return null
    }

    return (
      <View style={styles.ellipsisContainer}>
        <TouchableOpacity style={styles.ellipsisTouchable} onPress={this.openEllipsisMenu}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
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

  private openEllipsisMenu = () => {

    const buttons = [
      {
        title: 'Block User',
        onPress: () => {
          if (this.props.type !== 'normal') {
            return
          }
          this.swipe('left', true)
          this.props.block(this.props.profile.id, this.props.profile.email)
        },
      },
      {
        title: 'Report User',
        onPress: () => {
          if (this.props.type !== 'normal') {
            return
          }
          reportUser(this.props.profile)
        },
      },
    ]
    const {options, callback} = generateActionSheetOptions(buttons)
    this.props.type === 'normal' && this.props.showActionSheetWithOptions(options, callback)
  }

  private onPressReact = (react: ProfileReact) => {
    if (this.props.type === 'loading') {
      return
    }
    this.props.react(this.props.profile.profileReacts.value.reduce((reacts, r) => {
      if (react.id !== r.id && r.reacted) {
        reacts.push(r)
      } else if (react.id === r.id && !r.reacted) {
        reacts.push(r)
      }
      return reacts
    }, [] as ProfileReact[]), this.props.profile.id)
  }

  private cardWidth = () => WIDTH - 2 * HORIZONTAL_MARGIN

  private canSwipeManually = () => {
    return this.canSwipeProgrammatically() && this.state.fullyContracted
  }

  private canSwipeProgrammatically = () => {
    return (
      this.props.type === 'normal'
      && this.props.positionInStack === 0
      && !this.isSwipingProgrammatically
      && !this.didSwipe
    )
  }

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

  private onMomentumScrollCard = (isMomentumScrolling: boolean) => () => this.safeSetState({isMomentumScrolling})

  private onScrollCard = (event: ScrollEvent) => {

    /* if the user is scrolling the card and is closer to the top,
     * then the background of the ScrollView should be transparent so that
     * when the user scrolls past the top of the card, the background (the
     * other cards) are visible. Otherwise, the background should be white,
     * since we don't want anything shown in the background when the user
     * scrolls past the bottom. This only applies to IOS since ScrollViews
     * don't bounce on Android.
     */

    if (Platform.OS !== 'ios') {
     return
    }

    const {contentOffset, contentSize, layoutMeasurement} = event.nativeEvent
    if (this.props.type === 'normal') {
      let closerToTop: boolean
      if (contentSize.height < HEIGHT) {
        closerToTop = contentOffset.y <= 0
      } else {
        closerToTop = contentOffset.y < (contentSize.height - layoutMeasurement.height) / 2
      }
      this.safeSetState({
        scrollViewBackgroundColor: closerToTop ? 'transparent' : 'white',
      })
    }

    /* if the user has pulled the card down enough, then contract the card */
    const pulledDownEnough = contentOffset.y < -90
    if (pulledDownEnough) {
      if (this.props.type === 'preview') {
        this.exitExpandedCard()
      } else if (this.props.type === 'normal') {
        this.setMarginFromScrollViewBounce(event)
        this.contractCard(true)
      }
    }
  }

  private exitExpandedCard = () => {
    if (this.props.type === 'preview') {
      this.props.exit()
    } else if (this.props.type === 'normal') {
      if (this.state.fullyExpanded) {
        this.mainScrollView && this.mainScrollView.getNode().scrollTo({x: 0, y: 0, animated: false})
        this.contractCard(true)
      }
    }
  }

  private swipe = (direction: Direction, wasBlock = false) => {
    const onComplete = () => {
      if (this.props.type === 'normal') {
        this.props.onExitExpandedView && this.props.onExitExpandedView()
        this.onCompleteSwipe(direction, wasBlock)
      }
    }
    if (!wasBlock) {
      this.isSwipingProgrammatically = true
      const xValue = this.cardWidth() * 2 * (direction === 'right' ? 1 : -1)
      const yValue = 50

      Animated.parallel([
        Animated.timing(this.state.pan, { toValue: {x: xValue, y: yValue}, duration: 300 }),
        Animated.timing(this.state.panX, { toValue: xValue, duration: 300 }),
      ]).start(onComplete)
    } else {
      onComplete()
    }
  }

  private onCompleteSwipe = (direction: Direction, wasBlock = false) => {
    if (this.props.type !== 'normal') {
      return
    }
    this.props.onCompleteSwipe && this.props.onCompleteSwipe(direction, this.props.profile.id, wasBlock)
    this.carousel && this.carousel.reset(false)
    this.state.expansion.setValue(0)
    this.state.margin.top.setValue(this.getContractedMarginTop(-1))
    this.state.margin.horizontal.setValue(this.getContractedMarginHorizontal(-1))
    this.safeSetState({
      fullyContracted: true,
      fullyExpanded: false,
    }, () => {
      this.state.pan.setValue({x: 0, y: 0})
      this.state.panX.setValue(0)
      this.didSwipe = false
      this.isSwipingProgrammatically = false
    })
  }

  private setupGestureResponders = () => {

    this.cardPanResponder = PanResponder.create({

      onStartShouldSetPanResponder: () => this.canSwipeManually(),
      onStartShouldSetPanResponderCapture: () => this.canSwipeManually(),

      onPanResponderMove: (event, gestureState) => {
        if (this.canSwipeManually() && this.isSwipe(gestureState)) {
          this.isSwiping = true
          Animated.event([null, {dx: this.state.pan.x, dy: this.state.pan.y}])(event, gestureState)
          Animated.event([null, {dx: this.state.panX}])(event, gestureState)
        }
      },

      onPanResponderRelease: (_, gestureState) => {

        if (!this.canSwipeManually()) {
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
          this.didSwipe = true
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
            Animated.spring(this.state.pan, { toValue: { x: 0, y: 0 }, friction: 6 }),
            Animated.spring(this.state.panX, { toValue: 0, friction: 6 }),
          ]).start()
        }
      },
    })
  }

  private getContractedMarginTop = (positionInStack?: number) => {
    if (positionInStack === undefined) {
      switch (this.props.type) {
        case 'loading':
          return VERTICAL_MARGIN
        case 'preview':
          return 0
        case 'normal':
          positionInStack = this.props.positionInStack
      }
    }
    if (positionInStack === 0) {
      return VERTICAL_MARGIN
    } else if (positionInStack === 1) {
      return VERTICAL_MARGIN - 5
    } else {
      return VERTICAL_MARGIN - 7
    }
  }

  private getContractedMarginHorizontal = (positionInStack?: number) => {
    if (positionInStack === undefined) {
      switch (this.props.type) {
        case 'loading':
          return HORIZONTAL_MARGIN
        case 'preview':
          return 0
        case 'normal':
          positionInStack = this.props.positionInStack
      }
    }
    if (positionInStack === 0) {
      return HORIZONTAL_MARGIN
    } else if (positionInStack === 1) {
      return HORIZONTAL_MARGIN + 5
    } else {
      return HORIZONTAL_MARGIN + 7
    }
  }

  private getInitialState = (): State => {
    const initiallyExpanded = this.props.type === 'preview'

    return {
      pan: new Animated.ValueXY(),
      panX: new Animated.Value(0),
      expansion: new Animated.Value(this.props.type === 'preview' ? 1 : 0),
      fullyExpanded: initiallyExpanded,
      fullyContracted: !initiallyExpanded,
      margin: {
        top: new Animated.Value(this.getContractedMarginTop()),
        bottom: new Animated.Value(initiallyExpanded ? 0 : VERTICAL_MARGIN),
        horizontal: new Animated.Value(this.getContractedMarginHorizontal()),
      },
      easedIn: this.props.type !== 'normal' || this.props.positionInStack === 0,
      scrollViewBackgroundColor: 'transparent',
      isMomentumScrolling: false,

    }
  }

  private safeSetState = (newState: Partial<State>, callback?: () => void) => {
    if (this.componentIsMounted) {
      this.setState(newState as any, callback) /* tslint:disable-line:no-any */
    }
  }
}

export default Card

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  outerContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    overflow: Platform.OS === 'ios' ? 'hidden' : 'visible',
  },
  scrollView: {
    flex: 1,
  },
  firstCard: {
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowRadius: 5,
        shadowOpacity: 0.1,
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
    paddingHorizontal: BOTTOM_CONTAINER_HORIZONTAL_PADDING,
  },
  tagsContainer: {
    flexDirection: 'row',
  },
  tagsSectionContainer: {
    flex: 1,
  },
  name: {
    color: 'rgb(66, 64, 64)',
    fontSize: 20,
    marginVertical: 10,
    marginRight: 7,
  },
  tag: {
    color: '#9B9B9B',
    fontSize: 14,
  },
  emoji: {
    fontSize: 12,
  },
  bio: {
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.34,
    marginTop: 25,
    color: 'rgb(66, 64, 64)',
  },
  ellipsisContainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  ellipsisTouchable: {
    padding: 15,
  },
  exitContainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 15,
    top: 20,
  },
  exitIcon: {
    height: 20,
    width: 20,
  },
  imagePlaceholder: {
    backgroundColor: 'rgb(240, 240, 240)',
    height: WIDTH - 2 * HORIZONTAL_MARGIN,
    width: WIDTH - 2 * HORIZONTAL_MARGIN,
  },
  namePlaceholder: {
    marginTop: 12,
    marginBottom: 17,
  },
  tagPlaceholder: {
    marginBottom: 5,
  },
  dot: {
    borderWidth: 0.5,
    marginVertical: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderColor: 'gray',
    backgroundColor: 'white',
  },
  fullName: {
    flexDirection: 'row',
  },
  hashContainer: {
    marginRight: 2,
    marginTop: 2,
    height: '100%',
  },
  hash: {
    width: 15,
    height: 15,
  },
  classYearContainer: {
    top: 7,
    left: 10,
    borderRadius: 15,
  },
  classYearText: {
    fontSize: 15,
    marginTop: 5,
    marginBottom: 3,
    marginHorizontal: 17,
    color: 'white',
    letterSpacing: 1.33,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  seniorGoalContainer: {
    marginTop: 15,
  },
  seniorGoalText: {
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.34,
    color: 'rgb(66, 64, 64)',
  },
  profileText: {
    marginBottom: 40,
  },
})
