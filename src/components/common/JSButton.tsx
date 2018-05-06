import React, { PureComponent } from 'react'
import { Animated, StyleSheet, TouchableWithoutFeedback, TouchableWithoutFeedbackProps } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import JSText from './JSText'

interface Props extends TouchableWithoutFeedbackProps {
  label: string
  containerStyle?: any /* tslint:disable-line:no-any */
  textStyle?: any /* tslint:disable-line:no-any */
  colors?: string[] // two colors for the gradient
  active?: boolean // darker color (ignored if colors prop is defined)
  bold?: boolean
}

interface State {
  buttonPressedIn: boolean,
  scale: Animated.Value
}

export type JSButtonProps = Props

class JSButton extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      buttonPressedIn: false,
      scale: new Animated.Value(1),
    }
  }

  public render() {

    const containerStyle = [
      styles.container,
      this.props.containerStyle,
      {
        transform: [
          {
            scaleX: this.state.scale.interpolate({
              inputRange: [0, 1],
              outputRange: [0.95, 1],
            }),
          },
          {
            scaleY: this.state.scale.interpolate({
              inputRange: [0, 1],
              outputRange: [0.95, 1],
            }),
          },
        ],
      },
    ]

    if (this.props.colors && this.props.colors.length === 1) {
      containerStyle.push({
        backgroundColor: this.props.colors[0],
      })
      return (
        <Animated.View style={[containerStyle, styles.button, this.props.style]}>
          {this.renderTouchable()}
        </Animated.View>
      )
    }

    return (
      <Animated.View style={containerStyle}>
        <LinearGradient
          colors={this.props.colors || this.getColors()}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 1}}
          locations={[0, 1]}
          style={[styles.button, this.props.style]}
        >
          {this.renderTouchable()}
        </LinearGradient>
      </Animated.View>
    )
  }

  private renderTouchable = () => {
    const {label, disabled, bold, colors, style, textStyle, ...otherProps} = this.props

    const textStyles = [textStyle]
    if (disabled) {
      textStyles.push(styles.disabled)
    }

    return (
      <TouchableWithoutFeedback
        onPress={this.props.onPress}
        onPressIn={this.onPressIn}
        onPressOut={this.onPressOut}
        disabled={this.props.disabled}
        {...otherProps}
      >
        <JSText bold={bold} style={[styles.text, textStyle]}>
          {label}
        </JSText>
      </TouchableWithoutFeedback>
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

  private onPressIn = () => {
    this.setState({buttonPressedIn: true})
    this.changeScale(true)
  }

  private onPressOut = () => {
    this.setState({buttonPressedIn: false})
    this.changeScale(false)
  }

  private changeScale = (shrink: boolean) => {
    this.state.scale.stopAnimation()
    Animated.timing(
      this.state.scale,
      {
        toValue: shrink ? 0 : 1,
        duration: 200,
      }
    ).start()
  }
}

export default JSButton

const styles = StyleSheet.create({
  container: {
    borderRadius: 21,
    overflow: 'hidden',
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
