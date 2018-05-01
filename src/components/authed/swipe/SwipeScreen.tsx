import React, { PureComponent } from 'react'
import { Animated, Platform, StyleSheet, View, ViewStyle } from 'react-native'
import { ActionSheetProps, connectActionSheet } from '@expo/react-native-action-sheet'
import LinearGradient from 'react-native-linear-gradient'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../../redux'
import { Direction } from '../../../services/api'
import { fetchSwipableUsers, swipe, react, User, SwipeState } from '../../../services/swipe'
import { ProfileReact } from '../../../services/profile'
import { CircleButton, CircleButtonProps } from '../../common'
import { mod } from '../../../utils'
import Card from './Card'
import NoMoreCards from './NoMoreCards'

interface OwnProps {
  preview?: {
    user: User
    onExit: () => void
  }
}

export type SwipeScreenProps = OwnProps

type StateProps = SwipeState & {
  postRelease2: boolean
  currentUserID: number
}

interface DispatchProps {
  swipe: (direction: Direction, onUser: User) => void
  react: (reacts: ProfileReact[], onUser: User) => void
  fetchSwipableUsers: () => void
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
    if (!this.props.swipableUsers.loading && this.props.swipableUsers.value.size === 0) {
      this.fetchUsers()
    }
    this.loadingScreenTimer = setTimeout(() => {
      this.setState({
        mustShowLoadingScreen: false,
      })
    }, 2000)
  }

  componentWillUnmount() {
    clearTimeout(this.loadingScreenTimer)
  }

  public render() {
    if (!this.props.preview) {
      if (this.props.swipableUsers.value.size === 0 || this.props.allUsers.value.size === 0) {
        if (this.props.swipableUsers.loading || this.props.allUsers.loading || this.state.mustShowLoadingScreen) {
          return <Card type='loading' />
        } else {
          return <NoMoreCards requestMoreCards={this.requestMoreUsers}/>
        }
      }
    }

    return (
      <View style={styles.fill}>
        {this.renderCards()}
        {this.renderGradient()}
        {this.renderCrossButton()}
        {this.renderHeartButton()}
      </View>
    )
  }

  private renderCards = () => {
    if (this.props.preview) {
      return (
        <Card
          type='preview'
          profile={this.props.preview.user}
          exit={this.props.preview.onExit}
          shouldShowReacts={this.props.preview.user.id !== this.props.currentUserID}
        />
      )
    }

    const cards = []
    for (let i = 0; i < NUM_RENDERED_CARDS; i++) {
      cards.push(this.renderCard(i))
    }
    return cards
  }

  private renderCard = (cardIndex: number) => {

    const card = this.getCard(cardIndex)
    if (card === undefined) {
      return null
    }
    const positionInStack = this.calculatePositionInStack(cardIndex)

    // ensure that top card loads first
    if (cardIndex > 0 && !this.state.topCardLoaded) {
      return null
    }

    return (
      <Card
        type='normal'
        positionInStack={positionInStack}
        profile={this.props.allUsers.value.get(card)}
        showClassYear={this.props.postRelease2}
        onExpandCard={this.onExpandCard}
        onExitExpandedView={this.onExitExpandedView}
        onCompleteSwipe={this.onCompleteSwipe}
        react={this.props.react}
        key={cardIndex}
        ref={this.assignCardRef(positionInStack)}
        showActionSheetWithOptions={this.props.showActionSheetWithOptions!}
        postRelease2={this.props.postRelease2}
      />
    )
  }

  private renderGradient = () => {

    const gradientStyle = {
      height: this.state.expansion.interpolate({
        inputRange: [0, 1],
        outputRange: ['20%', '0%'],
      }),
      opacity: this.state.expansion.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
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

    if (this.state.fullyExpanded) {
      return null
    }

    const containerStyle = {
      opacity: this.state.expansion.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      }),
    }

    return (
      <CircleButton
        {...props}
        style={[styles.circleButton, containerStyle, style]}
      />
    )
  }

  private renderCrossButton = () => {
    return this.renderCircleButton({
        IconClass: Entypo,
        iconName: 'cross',
        iconSize: 50,
        iconColor: 'rgba(172,203,238,0.6)',
        onPress: () => this.topCard && this.topCard.swipeLeft(),
      }, {
        left: '15%',
      }
    )
  }

  private renderHeartButton = () => {
    return this.renderCircleButton({
        IconClass: MaterialCommunityIcons,
        iconName: 'heart',
        iconSize: 40,
        iconColor: '#ACCBEE',
        onPress: () => this.topCard && this.topCard.swipeRight(),
      }, {
        right: '15%',
      }
    )
  }

  private requestMoreUsers = () => {
    this.setState({
      profiles: [],
    }, this.fetchUsers)
  }

  private fetchUsers = () => {
    this.props.fetchSwipableUsers()
    this.setState({
      mustShowLoadingScreen: true,
    }, () => setTimeout(() => {
      this.setState({
        mustShowLoadingScreen: false,
      })
    }, 2000))
  }

  private assignCardRef = (positionInStack: number) => (ref: Card) => {
    if (positionInStack === 0) {
      this.topCard = ref
      setTimeout(() => {
        this.setState({
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
      this.setState({
        fullyExpanded: true,
      })
    })
  }

  private onExitExpandedView = () => {
    if (this.props.preview) {
      this.props.preview.onExit()
      return
    }
    this.setState({
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

  private onCompleteSwipe = (direction: Direction, onUser: User) => {
    let newProfiles = []
    for (let positionInStack = 0; positionInStack < NUM_RENDERED_CARDS; positionInStack++) {
      const cardIndex = (this.getCardIndexOfTopCard() + positionInStack) % NUM_RENDERED_CARDS
      let nextCard = this.getNextCard(cardIndex)
      if (direction === 'right' && nextCard && nextCard === onUser.id) {
        continue
      }
      newProfiles[cardIndex] = nextCard
    }
    this.cardIndexOfTopCard += 1
    this.cardIndexOfTopCard %= NUM_RENDERED_CARDS
    this.setState({
      profiles: newProfiles,
    })

    this.props.swipe(direction, onUser)

    if (!this.props.swipableUsers.loading) {
      const numUserUntilEnd = this.props.swipableUsers.value.size - this.props.indexOfUserOnTop
      const beenLongEnough = (
        !this.props.swipableUsers.lastFetched || (Date.now() - this.props.swipableUsers.lastFetched) / 1000 >= 10
      )
      if (numUserUntilEnd <= 10 && beenLongEnough) {
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
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    ...state.swipe,
    postRelease2: state.time.postRelease2,
    currentUserID: state.profile.id,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    fetchSwipableUsers: () => dispatch(fetchSwipableUsers()),
    swipe: (direction: Direction, onUser: User) => dispatch(swipe(direction, onUser)),
    react: (reacts: ProfileReact[], onUser: User) => dispatch(react(reacts, onUser)),
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
})
