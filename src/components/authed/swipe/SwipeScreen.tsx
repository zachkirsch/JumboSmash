import React, { PureComponent } from 'react'
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { NavigationTabScreenOptions } from 'react-navigation'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SwipeCards from './SwipeCards'
import Swiper from 'react-native-deck-swiper'
import LinearGradient from 'react-native-linear-gradient'
import Card from './Card'
import { JSText, moderateScale } from '../../generic'

const CARDS = [{}, {}]

const { width, height } = Dimensions.get('window')

class SwipeScreen extends PureComponent<{}, {}> {

  static navigationOptions: NavigationTabScreenOptions = {
    tabBarIcon: ({focused, tintColor}) => (
      <FontAwesome
        name={focused ? 'heart' : 'heart-o'}
        size={24}
        style={{ color: tintColor }}
      />
    ),
  }

  private swiper: Swiper

  public render() {
    return (
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          {this.renderSwiper()}
        </View>
        <View style={styles.overlay}>
          <LinearGradient
            colors={['rgba(217,228,239,0)', 'rgba(217,228,239,1)']}
            start={{x: 0, y: 0}} end={{x: 0, y: 0.75}}
            style={styles.gradient}
          />
        </View>
        <View style={[styles.overlay, styles.buttonOverlay]}>
          <TouchableOpacity style={styles.button} onPress={this.swipeLeft}>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Entypo style={styles.icon} name='cross' size={50} color='rgba(172,203,238,0.6)' />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.swipeRight}>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <MaterialCommunityIcons style={styles.icon} name='heart' size={40} color='#ACCBEE' />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  private renderSwiper = () => {
    return (
      <Swiper
        cards={CARDS}
        renderCard={() => <Card />}
        backgroundColor={'white'}
        cardVerticalMargin={0}
        cardHorizontalMargin={0}
        verticalSwipe={false}
        infinite
        ref={(ref: Swiper) => this.swiper = ref}
      />
    )
  }

  private swipeRight = () => {
    this.swiper && this.swiper.swipeRight()
  }

  private swipeLeft = () => {
    this.swiper && this.swiper.swipeLeft()
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
    height: '17%',
    bottom: 0,
    left: 0,
    elevation: 4,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 25,
    backgroundColor: 'white',
    height: 60,
    width: 60,
    borderRadius: 30,
    shadowColor: 'rgb(0, 0, 0)',
    shadowRadius: 5,
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 0},
    elevation: 3,
  },
  icon: {
    marginTop: moderateScale(3),
    backgroundColor: 'transparent',
  },
})
