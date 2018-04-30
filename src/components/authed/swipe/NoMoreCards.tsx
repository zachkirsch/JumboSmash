import React, { PureComponent } from 'react'
import { TouchableOpacity, View, Image, StyleSheet} from 'react-native'
import { JSText } from '../../common'
import { Images } from '../../../assets/img'

interface Props {
  requestMoreCards: () => void
}

class NoMoreCards extends PureComponent<Props, {}> {

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image resizeMode='stretch' source={require('../../../assets/img/butt.png')} style={styles.image} />
          <JSText style={styles.text}>You've run out of people to swipe on! </JSText>
          <JSText style={styles.subtext}>Tap the button below to load more cards. </JSText>
        <TouchableOpacity style={{alignSelf: 'center'}} onPress={this.props.requestMoreCards}>
          <Image resizeMode='stretch' source={require('../../../assets/img/restartButton.png')} style={styles.Smallimage} />
        </TouchableOpacity>
      </View>
    )
  }
}

export default NoMoreCards

const styles = StyleSheet.create({
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    width:100,
    height: 100,
  },
  Smallimage: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    width:60,
    height: 60,
  },
  text: {
    paddingLeft: 45,
    paddingRight: 45,
    paddingTop: 45,
    textAlign: 'center',
  },
  subtext: {
    paddingLeft: 45,
    paddingRight: 45,
    paddingBottom: 45,
    textAlign: 'center',
  }
})
