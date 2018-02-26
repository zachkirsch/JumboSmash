import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { verticalScale, scale, JSText } from '../../generic'

interface Props {
  image: string
}

export class Card extends PureComponent<Props, {}> {
  public render() {
    return (
      <View style={styles.card}>
        <View style={styles.topContainer}>
          <View style={styles.profilePicContainer}>
            <Image borderTopLeftRadius={20} borderTopRightRadius={20} style={styles.profilePic} source={require('../../../img/yuki.jpg')}/>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <JSText fontSize={20} style={styles.name}>Yuki</JSText>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    shadowColor: 'black',
    shadowRadius: 5,
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 0},
    borderRadius: 20,
    elevation: 3,
    margin: 20,
    marginBottom: 80,
  },
  topContainer: {
    flex: 3,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  profilePicContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePic: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 20,
  },
  name: {
    flex: 1,
    color: 'rgb(66, 64, 64)',
  }
})

export default Card
