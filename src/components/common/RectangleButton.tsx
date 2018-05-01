import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import JSButton, { JSButtonProps } from './JSButton'

interface Props extends JSButtonProps {
  active?: boolean // darker color
}

class RectangleButton extends PureComponent<Props, {}> {

  render() {

    const { containerStyle, textStyle, disabled, ...otherProps } = this.props

    const colors = this.getColors()

    const textStyles = [textStyle]
    if (disabled) {
      textStyles.push(styles.disabled)
    }

    return (
      <JSButton
        {...otherProps}
        disabled={disabled}
        textStyle={textStyles}
        containerStyle={[styles.buttonContainer, containerStyle]}
        colors={colors}
      />
    )
  }

  private getColors = () => {
    const opacity = this.props.disabled ? 0.75 : 1
    if (this.props.active) {
      return [
        `rgba(231, 240, 252, ${opacity})`,
        `rgba(178, 203, 238, ${opacity})`,
      ]
    } else {
      return [
        `rgba(231, 240, 253, ${opacity})`,
        `rgba(219, 230, 242, ${opacity})`,
      ]
    }
  }
}

export default RectangleButton

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 5,
    marginHorizontal: 20,
    borderRadius: 5,
  },
  disabled: {
    color: 'gray',
  },
})
