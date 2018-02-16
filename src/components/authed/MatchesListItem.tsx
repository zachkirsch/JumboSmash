import React, { PureComponent } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'

interface Props {
  name: string
  onPress: () => void
}

interface State {

}

class MatchesListItem extends PureComponent<Props, State> {

  public render() {
    return (
      <View>
        <TouchableOpacity onPress={this.props.onPress}>
          <Text>{this.props.name}</Text>
        </TouchableOpacity>
      </View>
    )
  }

}

export default MatchesListItem
