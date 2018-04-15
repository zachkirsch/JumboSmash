import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Platform, Image} from 'react-native';
import Carousel from 'simple-carousel-react-native';
import SafeAreaView from 'react-native-safe-area-view'
import { JSText, JSButton } from '../../common'

interface OwnProps {
  finishTutorial: () => void
}
type Props = OwnProps

class TutorialScreen extends PureComponent<Props, {}> {
  render(){
    return(
      <View style={styles.fill}>
        <Carousel style={styles.carousel} color='rgba(172, 203, 238, 0.75)' bubbleWidth={20}>
          <View>
            <Image style={styles.bottom} resizeMode="stretch" source={require('../../../assets/img/TutorialSlide1Small.png')}/>
            {this.renderHeadings('CREATE A PROFILE')}
            {this.rendersubHeadings('Put your best foot forward to the rest of the senior class')}
          </View>
          <View>
            <Image style={styles.bottom} resizeMode="stretch" source={require('../../../assets/img/TutorialSlide2.png')}/>
            {this.renderHeadings('REACT ON FRIENDS')}
            {this.rendersubHeadings('Let your friends know what you think of their profiles')}
          </View>
          <View>
          <Image  style={styles.bottom} resizeMode="stretch" source={require('../../../assets/img/TutorialSlide3.png')}/>
            {this.renderHeadings('MAKE NEW FRIENDS ;)')}
            {this.rendersubHeadings('We hope this one is self explanatory')}
          </View>
          <View>
            {this.renderHeadings("Happy Smashing!")}
            <View style={styles.bigcontainer}></View><View style={styles.bigcontainer}></View>
            <View style={styles.bigcontainer}></View><View style={styles.bigcontainer}></View>
          <JSButton label="lemme smash" onPress={this.props.finishTutorial}> Let's go</JSButton>

          </View>
        </Carousel>
        </View>

  )}
  private renderHeadings(text:string){
    return (<SafeAreaView style={styles.container}>
      <View style={styles.minititleContainer}>
        <JSText fontSize={22} style={styles.title}>{text}</JSText>
      </View>
    </SafeAreaView>)
  }
  private rendersubHeadings(text:string){
    return (<SafeAreaView style={styles.container}>
      <View style={styles.minititleContainer}>
        <JSText fontSize={17} style={{textAlign:'center'}}>{text}</JSText>
      </View>
    </SafeAreaView>)
  }
}

export default TutorialScreen


const styles = StyleSheet.create({
  fill: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigcontainer:{
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  carousel:{
    flex: 3,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  title:{
    fontWeight: 'bold'
  },
  container: {
    flexDirection: 'row',
    height: 66,
    zIndex: 20,
    ...Platform.select({
      ios: {
        shadowColor: 'white',
        shadowRadius: 5,
        shadowOpacity: 1,
      },
    }),
    ...Platform.select({
      android: {
        borderBottomWidth: 1,
        borderBottomColor: 'white',
      },
    }),
  },
  sideView: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  underline: {
    textDecorationLine: 'underline',
    color: '#171767',
  },
  titleContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  minititleContainer: {
    flex: 3,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    textAlign: 'center'
  },
  left: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    alignSelf: 'center',
    margin: 0,
    padding: 0
  }
})
