import React, { PureComponent } from 'react'
import { Animated, Platform, StyleSheet, View, ViewStyle } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../../redux'
import { Direction } from '../../../services/api'
import { fetchAllUsers, swipe, User, SwipeState } from '../../../services/swipe'
import { CircleButton, CircleButtonProps } from '../../common'
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

type Props = OwnProps & StateProps & DispatchProps

interface RenderedUser {
  user: User
  positionInStack: number
}

interface State {
  mustShowLoadingScreen: boolean
  expansion: Animated.Value
  profiles: { [cardIndex: number]: RenderedUser }
}

const NUM_RENDERED_CARDS = 6

class SwipeScreen extends PureComponent<Props, State> {

  private topCard: Card

  constructor(props: Props) {
    super(props)
    this.state = {
      expansion: new Animated.Value(props.preview ? 1 : 0),
      profiles: {},
      mustShowLoadingScreen: false,
    }
  }

  public render() {
    if (!this.props.preview) {
      if (this.props.allUsers.value.count() === 0) {
        if (this.props.allUsers.loading || this.state.mustShowLoadingScreen) {
          return <Card loading />
        } else {
          return <NoMoreCards requestMoreCards={this.fetchUsers}/>
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

    const cards = []
    for (let i = 0; i < NUM_RENDERED_CARDS; i++) {
      cards.push(this.renderCard(i))
    }
    return cards
  }

  private renderCard = (cardIndex: number) => {

    if (this.props.preview && cardIndex !== 0) {
      return null /* tslint:disable-line:no-null-keyword */
    }

    let positionInStack
    let profile

    if (this.props.preview) {
      profile = this.props.preview.user
    } else {
      const card = this.getCard(cardIndex)
      positionInStack = card.positionInStack
      profile = card.user
    }

    return (
      <Card
        previewMode={!!this.props.preview}
        positionInStack={positionInStack}
        profile={profile}
        onExpandCard={this.onExpandCard}
        onExitExpandedView={this.onExitExpandedView}
        onCompleteSwipe={this.onCompleteSwipe}
        key={cardIndex}
        ref={this.assignCardRef(positionInStack)}
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

    this.props.swipe(direction, onUser)

    if (!this.props.allUsers.loading) {
      const numUserUntilEnd = this.props.allUsers.value.count() - this.props.indexOfUserOnTop
      const secondsSinceFetched = (Date.now() - this.props.lastFetched) / 1000
      if (numUserUntilEnd <= 10 && secondsSinceFetched >= 60) {
        this.fetchUsers()
      }
    }

    // update profiles in state
    let newProfiles: { [cardIndex: string]: RenderedUser } = {}
    for (let i = 0; i < NUM_RENDERED_CARDS; i++) {
      newProfiles[i] = this.getNextCard(i)
    }
    this.setState({
      profiles: newProfiles,
    })
  }

  private getInitialCardForIndex = (cardIndex: number): RenderedUser => {
    const indexOfUser = cardIndex % this.props.allUsers.value.count()
    return {
      user: this.props.allUsers.value.get(indexOfUser),
      positionInStack: cardIndex,
    }
  }

  private getCard = (cardIndex: number): RenderedUser => {
    if (this.state.profiles[cardIndex]) {
      return this.state.profiles[cardIndex]
    } else {
      return this.getInitialCardForIndex(cardIndex)
    }
  }

  private getNextCard = (cardIndex: number): RenderedUser => {
    const currentCard = this.state.profiles[cardIndex] || this.getInitialCardForIndex(cardIndex)
    switch (currentCard.positionInStack) {
      case 0:
        const indexOfUser = (this.props.indexOfUserOnTop + NUM_RENDERED_CARDS) % this.props.allUsers.value.count()
        return {
          user: this.props.allUsers.value.get(indexOfUser),
          positionInStack: NUM_RENDERED_CARDS - 1,
        }
      default:
        const card = this.getCard(cardIndex)
        return {
          ...card,
          positionInStack: card.positionInStack - 1,
        }
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
