import React, { PureComponent } from 'react'
import { Animated, Platform, StyleSheet, View, ViewStyle } from 'react-native'
import { ActionSheetProps, connectActionSheet } from '@expo/react-native-action-sheet'
import LinearGradient from 'react-native-linear-gradient'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../../redux'
import { Direction } from '../../../services/api'
import { fetchAllUsers, swipe, User, SwipeState } from '../../../services/swipe'
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

type StateProps = SwipeState

interface DispatchProps {
  swipe: (direction: Direction, onUser: User) => void
  fetchAllUsers: () => void
}

type Props = ActionSheetProps<OwnProps & StateProps & DispatchProps>

interface State {
  mustShowLoadingScreen: boolean
  expansion: Animated.Value
  profiles: (User | undefined)[]
}

const NUM_RENDERED_CARDS = 5

@connectActionSheet
class SwipeScreen extends PureComponent<Props, State> {

  private topCard: Card
  private cardIndexOfTopCard = 0

  constructor(props: Props) {
    super(props)
    this.state = {
      expansion: new Animated.Value(props.preview ? 1 : 0),
      profiles: [],
      mustShowLoadingScreen: false,
    }
  }

  public render() {
    if (!this.props.preview) {
      if (this.props.allUsers.value.size === 0) {
        if (this.props.allUsers.loading || this.state.mustShowLoadingScreen) {
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

    if (this.props.preview && cardIndex !== 0) {
      return null
    }

    const card = this.getCard(cardIndex)
    if (card === undefined) {
      return null
    }
    const positionInStack = this.calculatePositionInStack(cardIndex)

    return (
      <Card
        type='normal'
        positionInStack={positionInStack}
        profile={card}
        onExpandCard={this.onExpandCard}
        onExitExpandedView={this.onExitExpandedView}
        onCompleteSwipe={this.onCompleteSwipe}
        key={cardIndex}
        ref={this.assignCardRef(positionInStack)}
        showActionSheetWithOptions={this.props.showActionSheetWithOptions!}
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
    this.props.fetchAllUsers()
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
    }
  }

  private onExpandCard = () => {
    Animated.timing(
      this.state.expansion,
      {
        toValue: 1,
        duration: 100,
      }
    ).start()
  }

  private onExitExpandedView = () => {
    if (this.props.preview) {
      this.props.preview.onExit()
      return
    }
    Animated.timing(
      this.state.expansion,
      {
        toValue: 0,
        duration: 100,
      }
    ).start()
  }

  private onCompleteSwipe = (direction: Direction, onUser: User) => {

    if (!this.props.allUsers.loading) {
      const numUserUntilEnd = this.props.allUsers.value.size - this.props.indexOfUserOnTop
      const beenLongEnough = this.props.lastFetched === undefined || (Date.now() - this.props.lastFetched) / 1000 >= 10
      if (numUserUntilEnd <= 10 && beenLongEnough) {
        this.fetchUsers()
      }
    }

    let newProfiles = []
    for (let positionInStack = 0; positionInStack < NUM_RENDERED_CARDS; positionInStack++) {
      const cardIndex = (this.getCardIndexOfTopCard() + positionInStack) % NUM_RENDERED_CARDS
      let nextCard = this.getNextCard(cardIndex)
      if (direction === 'right' && nextCard && nextCard.id === onUser.id) {
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
    const indexOfUser = this.calculatePositionInStack(cardIndex) % this.props.allUsers.value.size
    return this.props.allUsers.value.get(indexOfUser)
  }

  private getCard = (cardIndex: number): User => {
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
        const indexOfUser = (this.props.indexOfUserOnTop + NUM_RENDERED_CARDS) % this.props.allUsers.value.size
        return this.props.allUsers.value.get(indexOfUser)
      default:
        return currentCard
    }
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return state.swipe
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    fetchAllUsers: () => dispatch(fetchAllUsers()),
    swipe: (direction: Direction, onUser: User) => dispatch(swipe(direction, onUser)),
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
