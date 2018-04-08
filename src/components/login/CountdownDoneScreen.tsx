import React, { PureComponent } from 'react';
import { View, StyleSheet, Platform} from 'react-native';
import { JSText} from '../common'

class CountdownDoneScreen extends PureComponent<{}, {}> {
  render(){
    return(
      <View style={styles.fill}>
          <JSText fontSize={30}>
              Welcome to Jumbosmash!
            </JSText>
            <hr/>
            <JSText fontSize={22}> Please update your app in the app store to continue.
            </JSText>
          </View>
  )}
}

export default CountdownDoneScreen


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
