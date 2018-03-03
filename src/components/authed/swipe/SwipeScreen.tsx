import React, { PureComponent } from 'react'
import { Animated, View, StyleSheet } from 'react-native'
import { NavigationTabScreenOptions } from 'react-navigation'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import LinearGradient from 'react-native-linear-gradient'
import Card from './Card'
import { CircleButton, CircleButtonProps } from '../../generic'

interface Props {

}

interface State {
  expansion: Animated.Value
  possiblyTappingGradient: boolean
}

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

  private card: Card

  constructor(props: Props) {
    super(props)
    this.state = {
      expansion: new Animated.Value(0),
      possiblyTappingGradient: false,
    }
  }

  public render() {
    return (
      <View style={styles.container}>
        <Card
          onExpandCard={this.onExpandCard}
          onContractCard={this.onContractCard}
          ref={(ref: Card) => this.card = ref}
        />
        {this.renderGradient()}
        {this.renderCrossButton()}
        {this.renderHeartButton()}
      </View>
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
        onStartShouldSetResponder={() => {
          this.setState({
            possiblyTappingGradient: true,
          })
          return true
        }}
        onResponderMove={() => {
          this.setState({
            possiblyTappingGradient: false,
          })
        }}
        onResponderRelease={() => {
          if (this.state.possiblyTappingGradient) {
            this.card.tap()
          }
        }}
        style={[styles.overlay, gradientStyle]}
      >
        <LinearGradient
          colors={['rgba(217,228,239,0)', 'rgba(217,228,239,1)']}
          start={{x: 0, y: 0}} end={{x: 0, y: 0.75}}
          style={{flex: 1}}
        >
            <View style={{flex: 1}}/>
        </LinearGradient>
      </Animated.View>
    )
  }

  private renderCircleButton = (props: CircleButtonProps) => {

    const containerStyle = {
      opacity: this.state.expansion.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      }),
    }

    return (
      <Animated.View style={containerStyle}>
        <CircleButton
          {...props}
          style={{
            position: 'absolute',
            bottom: 20,
            ...props.style,
          }}
        />
      </Animated.View>
    )
  }

  private renderCrossButton = () => {
    return this.renderCircleButton({
      IconClass: Entypo,
      iconName: 'cross',
      iconSize: 50,
      iconColor: 'rgba(172,203,238,0.6)',
      style: {
        left: '20%',
      },
    })
  }

  private renderHeartButton = () => {
    return this.renderCircleButton({
      IconClass: MaterialCommunityIcons,
      iconName: 'heart',
      iconSize: 40,
      iconColor: '#ACCBEE',
      style: {
        right: '20%',
      },
    })
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
}

export default SwipeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '20%',
    bottom: 0,
    left: 0,
    elevation: 4,
  },
})
