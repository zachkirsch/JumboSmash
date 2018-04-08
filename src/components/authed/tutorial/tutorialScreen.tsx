import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Platform} from 'react-native';
import Carousel from 'simple-carousel-react-native';
import SafeAreaView from 'react-native-safe-area-view'
import { HeaderBar, JSText, JSTextInput } from '../../common'

class TutorialScreen extends PureComponent<{}, {}> {
  render(){
    return(
      <View style={styles.fill}>
      <View style={styles.fill}>
        <Carousel color='rgba(172, 203, 238, 0.75)' bubbleWidth={20}>
          <View>
            {this.renderHeadings('Welcome to Jumbosmash!')}
            <Text>
              Insert Image Here
            </Text>
          </View>
          <View>
            {this.renderHeadings('This is a little tutorial to get you started.')}
            <Text>
              Insert Image Here
            </Text>
          </View>
          <View>
            {this.renderHeadings('Edit your profile, swipe on and chat with potential matches')}
          <Text>
            Insert Image Here
          </Text>
          </View>
          <View>
            {this.renderHeadings("Add tags to your profiles")}
          <Text>
            Insert Image Here
          </Text>
          </View>
          <View>
            {this.renderHeadings("React on your friends bios")}
          <Text>
            Insert Image Here
          </Text>
          </View>
          <View>
            {this.renderHeadings("And finally, {insert final feature here that isn't second release}")}
          <Text>
            Insert Image Here
          </Text>
          </View>
          <View>
            {this.renderHeadings("Happy Smashing!")}
          <Text>
            Insert Image Here
          </Text>
          </View>
        </Carousel>
        </View>
        </View>
  )}
  private renderHeadings(text:string){
    return (<SafeAreaView style={styles.container}>
      <View style={styles.minititleContainer}>
        <JSText fontSize={17} style={styles.white}>{text}</JSText>
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
  container: {
    flexDirection: 'row',
    height: 66,
    zIndex: 20,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(172, 203, 238, 0.75)',
        shadowRadius: 5,
        shadowOpacity: 1,
      },
    }),
    ...Platform.select({
      android: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(172, 203, 238, 0.75)',
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
    backgroundColor: 'rgba(172, 203, 238, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
