import React, { PureComponent } from 'react'
import { Animated, Platform, StyleSheet, View, ViewStyle } from 'react-native'
import { ActionSheetProps, connectActionSheet } from '@expo/react-native-action-sheet'
import LinearGradient from 'react-native-linear-gradient'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../../redux'
import { Direction } from '../../../services/api'
import { fetchSwipableUsers, swipe, react, User, SwipeState } from '../../../services/swipe'
import { ProfileReact, blockUser } from '../../../services/profile'
import { CircleButton, CircleButtonProps } from '../../common'
import { mod, isSenior } from '../../../utils'
import { Images } from '../../../assets'
import Card from './Card'
import NoMoreCards from './NoMoreCards'

interface PreviewProps {
  onExit: () => void
}

interface SelfPreviewProps extends PreviewProps {
  type: 'self'
  profile: User
}

interface OtherPreviewProps extends PreviewProps {
  type: 'other'
  userId: number
}

interface OwnProps {
  preview?: SelfPreviewProps | OtherPreviewProps
}

export type SwipeScreenProps = OwnProps

type StateProps = SwipeState & {
  meId: number
  postRelease2: boolean
  classYear: number
  showUnderclassmen: boolean
}

interface DispatchProps {
  swipe: (direction: Direction, onUser: number, wasBlock: boolean) => void
  react: (reacts: ProfileReact[], onUser: number) => void
  fetchSwipableUsers: () => void
  blockUser: (userId: number, email: string) => void
}

type Props = ActionSheetProps<OwnProps & StateProps & DispatchProps>

interface State {
  mustShowLoadingScreen: boolean
  expansion: Animated.Value
  fullyExpanded: boolean
  profiles: (number | undefined)[] // user ID's
  topCardLoaded: boolean
}

const NUM_RENDERED_CARDS = 4

@connectActionSheet
class SwipeScreen extends PureComponent<Props, State> {

  private topCard: Card
  private cardIndexOfTopCard = 0
  private loadingScreenTimer: number
  private componentIsMounted = false

  constructor(props: Props) {
    super(props)
    this.state = {
      expansion: new Animated.Value(props.preview ? 1 : 0),
      fullyExpanded: !!this.props.preview,
      profiles: [],
      mustShowLoadingScreen: true,
      topCardLoaded: false,
    }
  }

  componentDidMount() {
    this.componentIsMounted = true
    if (!this.props.preview) {
      if (!this.props.swipableUsers.loading && this.props.swipableUsers.value.size === 0) {
        this.fetchUsers()
      }
      this.loadingScreenTimer = setTimeout(() => {
        this.safeSetState({
          mustShowLoadingScreen: false,
        })
      }, 2000)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.loadingScreenTimer)
    this.componentIsMounted = false
  }

  public render() {
    if (!this.props.preview) {
      if (this.props.swipableUsers.value.size === 0 || this.props.allUsers.value.size === 0) {
        if (this.props.swipableUsers.loading || this.props.allUsers.loading || this.state.mustShowLoadingScreen) {
          return <Card type='loading' />
        } else {
          return <NoMoreCards requestMoreCards={this.requestMoreUsers} issue='outOfCards' />
        }
      }
    }

    return (
      <View style={styles.fill}>
        {this.renderCards()}
        {!this.props.preview && this.renderGradient()}
        {!this.props.preview && this.renderCrossButton()}
        {!this.props.preview && this.renderHeartButton()}
      </View>
    )
  }

  private renderCards = () => {
    if (this.props.preview) {
      let profile = this.getProfileForPreview()
      if (!profile) {
        return null
      }
      return (
        <Card
          type='preview'
          profile={profile}
          exit={this.props.preview.onExit}
          react={this.props.react}
          reactsEnabled={this.props.meId !== profile.id}
          showClassYear={this.shouldShowClassYear(profile)}
        />
      )
    }

    const cards = []
    for (let i = 0; i < NUM_RENDERED_CARDS; i++) {
      cards.push(this.renderCard(i))
    }
    return cards
  }

  private getProfileForPreview = (): User | undefined => {
    if (!this.props.preview) {
      return
    }
    switch (this.props.preview.type) {
      case 'self':
        return this.props.preview.profile
      case 'other':
        return this.props.allUsers.value.get(this.props.preview.userId)
    }
  }

  private renderCard = (cardIndex: number) => {

    const card = this.getCard(cardIndex)
    if (card === undefined) {
      return null
    }

    // ensure that top card loads first
    if (cardIndex > 0 && !this.state.topCardLoaded) {
      return null
    }

    let containerStyle
    const positionInStack = this.calculatePositionInStack(cardIndex)
    if (positionInStack >= this.props.swipableUsers.value.size) {
      containerStyle = styles.hidden
    }

    const profile = this.props.allUsers.value.get(card)

    return (
      <Card
        type='normal'
        positionInStack={positionInStack}
        profile={profile}
        showClassYear={this.shouldShowClassYear(profile)}
        onExpandCard={this.onExpandCard}
        onExitExpandedView={this.onExitExpandedView}
        onCompleteSwipe={this.onCompleteSwipe}
        react={this.props.react}
        key={cardIndex}
        ref={this.assignCardRef(positionInStack)}
        showActionSheetWithOptions={this.props.showActionSheetWithOptions!}
        containerStyle={containerStyle}
        cardContainerStyle={styles.extraRoomForButtons}
        block={this.props.blockUser}
      />
    )
  }

  private renderGradient = () => {

    const gradientStyle = {
      height: this.state.expansion.interpolate({
        inputRange: [0, 1],
        outputRange: ['20%', '20%'],
      }),
      opacity: this.state.expansion.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1],
      }),
    }

    return (
      <Animated.View style={[styles.overlay, gradientStyle]} pointerEvents='none'>
        <LinearGradient
          colors={['rgba(217,228,239,0)', 'rgba(217,228,239,1)']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 0.75}}
          style={styles.fill}
        >
          <View style={styles.fill}/>
        </LinearGradient>
      </Animated.View>
    )
  }

  private renderCircleButton = (props: CircleButtonProps, style: ViewStyle) => {

    const containerStyle = {
      opacity: this.state.expansion.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1],
      }),
    }

    return (
      <CircleButton
        {...props}
        containerStyle={[styles.circleButton, containerStyle, style]}
        imageStyle={styles.buttonImage}
      />
    )
  }

  private renderCrossButton = () => {
    return this.renderCircleButton({
      type: 'image',
      onPress: () => this.topCard && this.topCard.swipeLeft(),
      source: Images.cross,
      }, {
        left: '15%',
      }
    )
  }

  private renderHeartButton = () => {
    return this.renderCircleButton({
        type: 'image',
        source: Images.heart,
        onPress: () => this.topCard && this.topCard.swipeRight(),
      }, {
        right: '15%',
      }
    )
  }

  private shouldShowClassYear = (user: User) => {
    return this.props.postRelease2
      && isSenior(this.props.classYear)
      && (this.props.showUnderclassmen || !isSenior(user.classYear))
  }

  private requestMoreUsers = () => {
    this.safeSetState({
      profiles: [],
    }, this.fetchUsers)
  }

  private fetchUsers = () => {
    this.props.fetchSwipableUsers()
    this.safeSetState({
      mustShowLoadingScreen: true,
    }, () => setTimeout(() => {
      this.safeSetState({
        mustShowLoadingScreen: false,
      })
    }, 2000))
  }

  private assignCardRef = (positionInStack: number) => (ref: Card) => {
    if (positionInStack === 0) {
      this.topCard = ref
      setTimeout(() => {
        this.safeSetState({
          topCardLoaded: true,
        })
      }, 500)
    }
  }

  private onExpandCard = () => {
    Animated.timing(
      this.state.expansion,
      {
        toValue: 1,
        duration: 300,
      }
    ).start(() => {
      this.safeSetState({
        fullyExpanded: true,
      })
    })
  }

  private onExitExpandedView = () => {
    if (this.props.preview) {
      this.props.preview.onExit()
      return
    }
    this.safeSetState({
      fullyExpanded: false,
    })
    Animated.timing(
      this.state.expansion,
      {
        toValue: 0,
        duration: 300,
      }
    ).start()
  }

  private onCompleteSwipe = (direction: Direction, onUser: number, wasBlock: boolean) => {
    let newProfiles = []
    for (let positionInStack = 0; positionInStack < NUM_RENDERED_CARDS; positionInStack++) {
      const cardIndex = (this.getCardIndexOfTopCard() + positionInStack) % NUM_RENDERED_CARDS
      let nextCard = this.getNextCard(cardIndex)
      if (direction === 'right' && nextCard && nextCard === onUser) {
        continue
      }
      newProfiles[cardIndex] = nextCard
    }
    this.cardIndexOfTopCard += 1
    this.cardIndexOfTopCard %= NUM_RENDERED_CARDS
    this.safeSetState({
      profiles: newProfiles,
    })

    this.props.swipe(direction, onUser, wasBlock)

    if (!this.props.swipableUsers.loading) {
      const numUserUntilEnd = this.props.swipableUsers.value.size - this.props.indexOfUserOnTop
      const beenLongEnough = (
        !this.props.swipableUsers.lastFetched || (Date.now() - this.props.swipableUsers.lastFetched) / 1000 >= 60
      )
      const beenTooLong = (
        !this.props.swipableUsers.lastFetched || (Date.now() - this.props.swipableUsers.lastFetched) / 1000 / 60 >= 10
      )
      if (beenTooLong || numUserUntilEnd <= 10 && beenLongEnough) {
        this.fetchUsers()
      }
    }

  }

  private calculatePositionInStack = (cardIndex: number) => {
    return mod(cardIndex - this.cardIndexOfTopCard, NUM_RENDERED_CARDS)
  }

  private getCardIndexOfTopCard = (): number => {
    for (let cardIndex = 0; cardIndex < NUM_RENDERED_CARDS; cardIndex++) {
      if (this.calculatePositionInStack(cardIndex) === 0) {
        return cardIndex
      }
    }
    return -1 // will never get here
  }

  private getInitialCardForIndex = (cardIndex: number) => {
    const indexOfUser = this.calculatePositionInStack(cardIndex) % this.props.swipableUsers.value.size
    return this.props.swipableUsers.value.get(indexOfUser)
  }

  private getCard = (cardIndex: number) => {
    const userInState = this.state.profiles[cardIndex]
    if (userInState) {
      return userInState
    } else {
      return this.getInitialCardForIndex(cardIndex)
    }
  }

  private getNextCard = (cardIndex: number) => {
    const currentCard = this.getCard(cardIndex)
    switch (this.calculatePositionInStack(cardIndex)) {
      case 0:
        const indexOfUser = (this.props.indexOfUserOnTop + NUM_RENDERED_CARDS) % this.props.swipableUsers.value.size
        return this.props.swipableUsers.value.get(indexOfUser)
      default:
        return currentCard
    }
  }

  private safeSetState = (newState: Partial<State>, callback?: () => void) => {
    if (this.componentIsMounted) {
      this.setState(newState as any, callback) /* tslint:disable-line:no-any */
    }
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    ...state.swipe,
    meId: state.profile.id,
    postRelease2: state.time.postRelease2,
    classYear: state.profile.classYear,
    showUnderclassmen: state.profile.showUnderclassmen.value,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    fetchSwipableUsers: () => dispatch(fetchSwipableUsers()),
    swipe: (direction: Direction, onUser: number, wasBlock: boolean) => dispatch(swipe(direction, onUser, wasBlock)),
    react: (reacts: ProfileReact[], onUser: number) => dispatch(react(reacts, onUser)),
    blockUser: (userId: number, email: string) => dispatch(blockUser(email, userId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SwipeScreen)

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '20%',
    bottom: 0,
    left: 0,
    zIndex: 11,
    ...Platform.select({
      android: {
        elevation: 11,
      },
    }),
  },
  circleButton: {
    position: 'absolute',
    bottom: 25,
    zIndex: 12,
    ...Platform.select({
      android: {
        elevation: 12,
      },
    }),
  },
  buttonImage: {
    width: 30,
    height: 30,
  },
  hidden: {
    opacity: 0,
  },
  extraRoomForButtons: {
    paddingBottom: 100,
  },
})
