import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import JSButton, { JSButtonProps } from './JSButton'

class RectangleButton extends PureComponent<JSButtonProps, {}> {
  render() {
    const { containerStyle, disabled, ...otherProps } = this.props
    return (
      <JSButton
        {...otherProps}
        containerStyle={[styles.buttonContainer, containerStyle]}
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
