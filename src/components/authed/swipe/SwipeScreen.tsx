import React, { PureComponent } from 'react'
import { Animated, View, StyleSheet, ViewStyle, PanResponder, Platform } from 'react-native'
import { NavigationTabScreenOptions } from 'react-navigation'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import LinearGradient from 'react-native-linear-gradient'
import Card from './Card'
import { CircleButton, CircleButtonProps } from '../../generic'

interface Props {
  preview?: {
    name: string
    imageUris: string[]
    onCompleteSwipe: () => void
  }
}

interface State {
  index: number
  expansion: Animated.Value
}

const IMAGES = [
  'https://www.howtophotographyourlife.com/wp-content/uploads/2015/06/mary-2-1.jpg',
  'https://blog.linkedin.com/content/dam/blog/en-us/corporate/blog/2014/07/Anais_Saint-Jude_L4388_SQ.jpg.jpeg',
  'https://www.travelingphotographer.com/images/DENTIST-square-headshot-3.jpg',
]

const NAMES = [
  {
    name: 'Sally',
    imageUris: [IMAGES[0], IMAGES[1], IMAGES[2]],
  },
  {
    name: 'Harriett',
    imageUris: [IMAGES[1], IMAGES[2], IMAGES[0]],
  },
  {
    name: 'George',
    imageUris: [IMAGES[2], IMAGES[0], IMAGES[1]],
  },
  {
    name: 'Stella',
    imageUris: [IMAGES[0], IMAGES[1], IMAGES[2]],
  },
  {
    name: 'Harry',
    imageUris: [IMAGES[1], IMAGES[2], IMAGES[0]],
  },
  {
    name: 'James',
    imageUris: [IMAGES[2], IMAGES[0], IMAGES[1]],
  },
]

class SwipeScreen extends PureComponent<Props, State> {

  static navigationOptions: NavigationTabScreenOptions = {
    tabBarIcon: ({focused, tintColor}) => (
      <FontAwesome
        name={focused ? 'heart' : 'heart-o'}
        size={24}
        style={{ color: tintColor }}
      />
    ),
  }

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
        {this.renderCard(0)}
        {this.renderCard(1)}
        {this.renderCard(2)}
        {this.renderGradient()}
        {this.renderCrossButton()}
        {this.renderHeartButton()}
      </View>
    )
  }

  private renderCard = (cardIndex: number) => {

    if (this.props.preview && cardIndex !== 0) {
      return null /* tslint:disable-line:no-null-keyword */
    }

    const positionInDeck = (((cardIndex - this.state.index) % 3) + 3) % 3
    const globalIndex = (this.state.index + positionInDeck) % NAMES.length

    let profile = NAMES[globalIndex]
    if (this.props.preview) {
      profile = {
        name: this.props.preview.name,
        imageUris: this.props.preview.imageUris,
      }
    }

    return (
      <Card
        previewMode={!!this.props.preview}
        positionInDeck={positionInDeck}
        {...profile}
        onExpandCard={this.onExpandCard}
        onContractCard={this.onContractCard}
        onCompleteSwipe={this.onCompleteSwipe}
        ref={(ref: Card) => {
          if (positionInDeck === 0) {
            this.topCard = ref
          }
        }}
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
          start={{x: 0, y: 0}} end={{x: 0, y: 0.75}}
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

  private onCompleteSwipe = () => {
    if (this.props.preview) {
      this.props.preview.onCompleteSwipe()
    } else {
      this.setState({
        index: this.state.index + 1,
      })
    }
  }
}

export default SwipeScreen

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
