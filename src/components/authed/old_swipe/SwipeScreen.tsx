import React, { PureComponent } from 'react'
import { Animated, View, TouchableWithoutFeedback, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { NavigationTabScreenOptions } from 'react-navigation'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import LinearGradient from 'react-native-linear-gradient'
import CardContainer from './CardContainer'
import { JSText, moderateScale, CircleButton } from '../../generic'

interface Props {

}

interface State {
  crossButtonPressedIn: boolean
  heartButtonPressedIn: boolean
  cardIsExpanded: boolean
  gradientOpacity: Animated.Value
  buttonsOpacity: Animated.Value
  shouldShowButtons: boolean
}

const WIDTH = Dimensions.get("window").width

const CARDS = [{index: 0, name: 'john'}, {index: 1, name: 'sally'}]

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

  private cardContainer: CardContainer

  constructor(props: Props) {
    super(props)
    this.state = {
      cardIsExpanded: false,
      crossButtonPressedIn: false,
      heartButtonPressedIn: false,
      buttonsOpacity: new Animated.Value(1),
      gradientOpacity: new Animated.Value(1),
      shouldShowButtons: true
    }
  }

  public render() {
    return (
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          {this.renderSwiper()}
        </View>
        {this.renderGradient()}
        {this.renderCrossButton()}
        {this.renderHeartButton()}
      </View>
    )
  }

  private renderGradient = () => {

    if (this.state.cardIsExpanded) {
      // return null
    }

    const gradientSize = this.state.gradientOpacity.interpolate({
      inputRange: [0.4, 1],
      outputRange: ['5%', '20%']
    })

    return (
      <Animated.View
        style={[styles.overlay, {
          height: gradientSize,
          opacity: this.state.gradientOpacity,
        }]  }
      >
      <TouchableWithoutFeedback style={{flex: 1}} onPress={() => { this.cardContainer && this.cardContainer.tapCard() }}>
      <LinearGradient
        colors={['rgba(217,228,239,0)', 'rgba(217,228,239,1)']}
        start={{x: 0, y: 0}} end={{x: 0, y: 0.75}}
        style={{flex: 1}}
      >
          <View style={{flex: 1}}/>
      </LinearGradient>
      </TouchableWithoutFeedback>
      </Animated.View>
    )
  }

  private renderCrossButton = () => {

    if (!this.state.shouldShowButtons) {
      return null
    }

    return (
      <Animated.View style={{opacity: this.state.buttonsOpacity}}>
      <CircleButton style={{
        position: 'absolute',
        bottom: 20,
        left: '20%',
      }}
      IconClass={Entypo} iconName='cross' iconSize={50} iconColor='rgba(172,203,238,0.6)'/>
      </Animated.View>
    )
  }

  private renderHeartButton = () => {

    if (!this.state.shouldShowButtons) {
      return null
    }
    return (
      <Animated.View style={{opacity: this.state.buttonsOpacity}}>
      <CircleButton
        style={{
          position: 'absolute',
          bottom: 20,
          right: '20%',
        }}
        IconClass={MaterialCommunityIcons} iconName='heart' iconSize={40} iconColor='#ACCBEE'
      />
      </Animated.View>
    )
    return (
      <Animated.View style={[styles.overlay, styles.buttonOverlay, {opacity: this.state.buttonsOpacity}]}>
        <CircleButton IconClass={Entypo} iconName='cross' iconSize={50} iconColor='rgba(172,203,238,0.6)'/>
      </Animated.View>
    )
  }

  private renderSwiper = () => {
    return <CardContainer onExpandCard={this.onExpandCard} onCardFinishedExpanding={this.onCardFinishedExpanding} onContractCard={this.onContractCard} ref={(ref) => this.cardContainer = ref}/>
  }

  private onContractCard = () => {
    return
    this.setState({
      cardIsExpanded: false,
      shouldShowButtons: true
    })
    Animated.timing(
      this.state.gradientOpacity,
      {
        toValue: 1,
        delay: 0,
        duration: 150,
      }
    ).start()
    Animated.timing(
      this.state.buttonsOpacity,
      {
        toValue: 1,
        delay: 0,
        duration: 150,
      }
    ).start()
  }

  private onExpandCard = () => {
    this.setState({
      cardIsExpanded: true,
    })
    Animated.timing(
      this.state.buttonsOpacity,
      {
        toValue: 0,
        delay: 0,
        duration: 150 ,
      }
    ).start(() => {
      this.setState({
        shouldShowButtons: false,
      })
    })
    Animated.timing(
      this.state.gradientOpacity,
      {
        toValue: 0.4,
        delay: 150,
        duration: 450,
      }
    ).start(() => {
      this.setState({
      })
    })
  }

  private onCardFinishedExpanding = () => {
  }
}

export default SwipeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '20%',
    bottom: 0,
    left: 0,
    elevation: 4,
  },
  gradient: {
    height: '100%',
  },
  buttonOverlay: {
    position: 'absolute',
    width: '100%',
    height: '15%',
    bottom: 0,
    left: 0,
    elevation: 4,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'red',
  },
  icon: {
    marginTop: moderateScale(3),
    backgroundColor: 'transparent',
  },
})
