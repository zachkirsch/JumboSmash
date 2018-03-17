import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import JSButton from './JSButton'

interface Props {
  label: string
  onPress: () => void
  active?: boolean // darker color
}

class RectangleButton extends PureComponent<Props, {}> {

  render() {
    return (
      <JSButton
        label={this.props.label}
        onPress={this.props.onPress}
        colors={this.props.active
                ? ['rgba(231, 240, 253, 1)', '#B1CAEF']
                : ['rgba(211, 224, 240, 0.5)', 'rgba(211, 224, 240, 0.8)']}
        containerStyle={styles.buttonContainer}
      />
    )
  }
}

export default RectangleButton

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 5,
    marginHorizontal: 20,
    borderRadius: 5,
  },
})
