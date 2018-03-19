import React, { PureComponent } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { JSText } from '../../generic'

interface Props {
  requestMoreCards: () => void
}

class NoMoreCards extends PureComponent<Props, {}> {

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity style={{width: 100, height: 100, backgroundColor: 'green'}} onPress={this.props.requestMoreCards}>
          <JSText>Click Here to Load More Cards</JSText>
        </TouchableOpacity>
      </View>
    )
  }
}

export default NoMoreCards
