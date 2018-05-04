import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, TouchableOpacityProperties } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import JSText from './JSText'

interface Props extends TouchableOpacityProperties {
  label: string
  containerStyle?: any /* tslint:disable-line:no-any */
  textStyle?: any /* tslint:disable-line:no-any */
  colors?: string[] // two colors for the gradient
  active?: boolean // darker color (ignored if colors prop is defined)
  bold?: boolean
}

export type JSButtonProps = Props

class JSButton extends PureComponent<Props, {}> {

  public render() {

    const containerStyle = [styles.container, this.props.containerStyle]

    if (this.props.colors && this.props.colors.length === 1) {
      containerStyle.push({
        backgroundColor: this.props.colors[0],
      })
      return (
        <View style={containerStyle}>
          {this.renderTouchable()}
        </View>
      )
    }

    return (
      <LinearGradient
        colors={this.props.colors || this.getColors()}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 1}}
        locations={[0, 1]}
        style={containerStyle}
      >
        {this.renderTouchable()}
      </LinearGradient>
    )
  }

  private renderTouchable = () => {
    const {label, disabled, bold, colors, style, containerStyle, textStyle, ...otherProps} = this.props

    const textStyles = [textStyle]
    if (disabled) {
      textStyles.push(styles.disabled)
    }

    return (
      <TouchableOpacity
        style={[styles.button, style]}
        disabled={disabled}
        {...otherProps}
      >
        <JSText bold={bold} style={[styles.text, textStyle]}>
          {label}
        </JSText>
      </TouchableOpacity>
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

export default JSButton

const styles = StyleSheet.create({
  container: {
    borderRadius: 21,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 60,
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 19,
    backgroundColor: 'transparent',
    marginVertical: 5,
    color: '#4A4A4A',
  },
  disabled: {
    color: 'gray',
  },
})
