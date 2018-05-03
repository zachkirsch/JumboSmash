import React, { PureComponent } from 'react'
import { Platform, TouchableOpacity, View, Image, StyleSheet} from 'react-native'
import { JSText } from '../../common'
import { Images } from '../../../assets'

interface Props {
  requestMoreCards: () => void
  issue: 'outOfCards' | 'noNetworkConnection'
}

class NoMoreCards extends PureComponent<Props, {}> {

  render() {
    return (
      <View style={styles.container}>
        <Image resizeMode='contain' source={Images.butt} style={styles.butt} />
          <JSText style={styles.text}>
            {this.getMessage()}
          </JSText>
        <TouchableOpacity onPress={this.props.requestMoreCards} style={styles.reloadContainer}>
          <Image resizeMode='contain' source={Images.reload} style={styles.reload} />
        </TouchableOpacity>
      </View>
    )
  }

  private getMessage = () => {
    switch (this.props.issue) {
      case 'outOfCards':
        return "You've run out of people to swipe on!\nTap the button below to load more cards."
      case 'noNetworkConnection':
        return "Can't connect to the server\nTap the button below to try to reconnect."
    }
  }

}

export default NoMoreCards

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  butt: {
    width: 100,
    height: 100,
  },
  reload: {
    width: 25,
    height: 25,
  },
  reloadContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowOpacity: 1,
        shadowColor: 'rgb(231, 240, 249)',
        shadowOffset: {
          width: 1,
          height: 1,
        },
        shadowRadius: 5,
      },
    }),
  },
  text: {
    padding: 25,
    textAlign: 'center',
  },
})
