import React, { PureComponent } from 'react'
import {
  StyleSheet,
  View,
} from 'react-native'
import { JSText } from '../common'

interface OwnProps {
}

type Props = OwnProps

class ConfirmLocationScreen extends PureComponent<Props, {}> {

  public render() {
    return (
      <View style={styles.flex}>
        <JSText>Confirm Location Screen</JSText>
      </View>
    )
  }
}

export default ConfirmLocationScreen

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: 'red',
  },
})
