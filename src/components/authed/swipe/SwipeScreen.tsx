import { List } from 'immutable'
import React, { PureComponent } from 'react'
import { Animated, PanResponder, Platform, StyleSheet, View, ViewStyle } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../../redux'
import { Direction } from '../../../services/api'
import { fetchAllUsers, swipe, User } from '../../../services/swipe'
import { CircleButton, CircleButtonProps, JSText } from '../../common'
import { mod } from '../../utils'
import Card from './Card'
import NoMoreCards from './NoMoreCards'

interface OwnProps {
  preview?: {
    user: User
    onCompleteSwipe: () => void
  }
}

interface StateProps {
  allUsers: List<User>
  loadingAllUsers: boolean
}

interface DispatchProps {
  swipe: (direction: Direction, onUser: User) => void
  fetchAllUsers: () => void
}

type Props = OwnProps & StateProps & DispatchProps

interface State {
  index: number
  expansion: Animated.Value
}

const NUM_RENDERED_CARDS = 3

class SwipeScreen extends PureComponent<Props, State> {

  private topCard: Card

  constructor(props: Props) {
    super(props)
    this.state = {
      index: 0,
      expansion: new Animated.Value(0),
    }
  }

  public render() {

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

    if (!this.props.preview) {
      if (this.props.loadingAllUsers) {
        return <JSText>Loading</JSText>
      }

      if (this.props.allUsers.size === 0) {
        return <NoMoreCards requestMoreCards={this.props.fetchAllUsers}/>
      }
    }

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

    let positionInDeck = 0
    let globalIndex = 0
    let profile

    if (this.props.preview) {
      profile = this.props.preview.user
    } else {
      positionInDeck = mod(cardIndex - this.state.index, NUM_RENDERED_CARDS)
      globalIndex = (this.state.index + positionInDeck) % this.props.allUsers.size

      if (globalIndex < 0 || globalIndex >= this.props.allUsers.size) {
        return null /* tslint:disable-line:no-null-keyword */
      }
      profile = this.props.allUsers.get(globalIndex)
    }

    return (
      <Card
        previewMode={!!this.props.preview}
        positionInDeck={positionInDeck}
        profile={profile}
        onExpandCard={this.onExpandCard}
        onContractCard={this.onContractCard}
        onCompleteSwipe={this.onCompleteSwipe}
        key={cardIndex}
        ref={this.assignCardRef(positionInDeck)}
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
      <Animated.View
        {...PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onPanResponderRelease: (_, gestureState) => {
            if (gestureState.moveX === 0 && gestureState.moveY === 0) {
              this.topCard.tap()
            }
          },
        }).panHandlers}
        style={[styles.overlay, gradientStyle]}
      >
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

  private assignCardRef = (positionInDeck: number) => (ref: Card) => {
    if (positionInDeck === 0) {
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

  private onContractCard = () => {
    Animated.timing(
      this.state.expansion,
      {
        toValue: 0,
        duration: 100,
      }
    ).start()
  }

  private onCompleteSwipe = (direction: Direction, onUser: User) => {
    if (this.props.preview) {
      this.props.preview.onCompleteSwipe()
    } else {
      this.props.swipe(direction, onUser)
      this.setState({
        index: this.state.index + 1,
      })
    }
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    allUsers: List(state.swipe.allUsers.value.filter((user) => user.images.length > 0)),
    loadingAllUsers: state.swipe.allUsers.loading,
  }
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
