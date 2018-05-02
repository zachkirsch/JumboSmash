import React, { PureComponent } from "react";
import {Dimensions, StyleSheet, View} from 'react-native';
import { JSText, JSImage } from './components/common'
import LinearGradient from 'react-native-linear-gradient'
import JSButton from "./components/common/JSButton";

interface Props {
  myAvatar: string
  matchAvatar: string
  matchName: string
  onDismiss: () => void
  onPressStartChat: () => void
}

const WIDTH = Dimensions.get('window').width

class MatchPopUp extends PureComponent<Props, {}> {
  render() {
    console.log('TEST')
    console.log(this.props.myAvatar)
    return (
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          <LinearGradient
            colors={['rgba(220,135,139,0.91)','rgba(250,208,196,0.93)']}
            start={{x: 1, y: 0}}
            end={{x: 0, y: 1}}
            locations={[0, 1]}
            style={styles.gradient}
          >
            <View style={styles.top}/>
            <View style={styles.avatarSection}>
              <JSImage cache source={{uri: this.props.myAvatar}} style={[styles.avatar,styles.myAvatar]}/>
              <JSImage cache source={{uri: this.props.matchAvatar}} style={[styles.avatar]}/>
            </View>
            <View style={styles.matchText}>
              <JSText style={styles.matchTextSettings}>You matched with {this.props.matchName}!</JSText>
            </View>
            <View style={styles.elephants}>
              <JSImage cache source={require('./assets/img/matchElephant.png')} style={[styles.elephantAvatar, styles.myAvatar]} resizeMode='contain'/>
              <View style={styles.matchAvatar}>
                <JSImage cache source={require('./assets/img/matchElephant.png')} style={[styles.elephantAvatar]} resizeMode='contain'/>
              </View>
            </View>
            <View style={[StyleSheet.absoluteFill, styles.buttons]}>
              <JSButton style={styles.button} onPress={this.props.onPressStartChat} label={'START A CHAT'} colors={['rgba(255,255,255,0.89)','rgba(255,255,255,0.89)']} textStyle={{ fontSize: 16 }}/>
              <JSButton containerStyle={styles.swipeButton} style={styles.button}  onPress={this.props.onDismiss} label={'KEEP SWIPING'} colors={['#DBA4A0','#DBA4A0']} textStyle={{ color: 'white', fontSize: 16 }}/>
            </View>
          </LinearGradient>
        </View>
      </View>
    )
  }
}

export default MatchPopUp

const styles = StyleSheet.create({
  outerContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  container: {
    flex: 1,
    borderRadius: 18,
    marginHorizontal: 20,
    marginTop: 75,
    marginBottom: 59,
  },
  avatar: {
    width: WIDTH / 3.75,
    height: WIDTH / 3.75,
    borderRadius: WIDTH / 7.5,
  },
  myAvatar: {
    marginRight: 35,
  },
  matchAvatar: {
    transform: [
      {
        scaleX: -1,
      },
    ],
  },
  gradient: {
    flex: 1,
    opacity: .99,
    borderRadius: 18,
  },
  avatarSection: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  elephants: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  elephantAvatar: {
    width: WIDTH / 3,
    height: WIDTH / 3 * 229/222,
  },
  top: {
    flex: 1.2,
    flexDirection: 'row',
  },
  matchText: {
    flex: 0.8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  matchTextSettings: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  buttons: {
    marginHorizontal: 60,
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  button: {
    paddingHorizontal: 0,
  },
  swipeButton: {
    marginTop: 10,
  },
})
