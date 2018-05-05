import React, { PureComponent } from 'react'
import { View, Image, StyleSheet} from 'react-native'
import { JSText, CircleButton } from '../../common'
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
          <CircleButton
            type='image'
            onPress={this.props.requestMoreCards}
            source={Images.reload}
            imageStyle={styles.reload}
          />
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
  text: {
    padding: 25,
    textAlign: 'center',
  },
})
