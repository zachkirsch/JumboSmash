import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import JSButton, { JSButtonProps } from './JSButton'

interface Props extends JSButtonProps {
  active?: boolean // darker color
}

class RectangleButton extends PureComponent<Props, {}> {

  render() {

    const { containerStyle, ...otherProps } = this.props

    const colors = this.props.active
                   ? ['rgba(231, 240, 253, 1)', '#B1CAEF']
                   : ['rgba(211, 224, 240, 0.5)', 'rgba(211, 224, 240, 0.8)']

    return (
      <JSButton
        {...otherProps}
        containerStyle={[styles.buttonContainer, containerStyle]}
        colors={colors}
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
