import React, { PureComponent } from 'react'
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  GestureResponderEvent,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import JSText from './JSText'

interface Props extends TouchableWithoutFeedbackProps {
  containerStyle?: any /* tslint:disable-line:no-any */
  colors?: string[] // one or two colors for the gradient
  active?: boolean // darker color (ignored if colors prop is given)

  // for simple text button, ignored if renderCenter prop is given
  label?: string
  textStyle?: any /* tslint:disable-line:no-any */
  bold?: boolean

  // for non-text butons
  renderCenter?: () => JSX.Element | null
}

interface State {
  scale: Animated.Value
}

export type JSButtonProps = Props

class JSButton extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      scale: new Animated.Value(1),
    }
  }

  public render() {

    const { label, bold, colors, style, textStyle, containerStyle, ...otherProps } = this.props

    const containerStyles = [
      styles.container,
      containerStyle,
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

    return (
        <Animated.View style={containerStyles}>
          <TouchableWithoutFeedback
            {...otherProps}
            onPressIn={this.onPressIn}
            onPressOut={this.onPressOut}
          >
            <LinearGradient
              colors={this.getColors()}
              start={{x: 0, y: 1}}
              end={{x: 1, y: 1}}
              locations={[0, 1]}
              style={[styles.button, style]}
            >
              {this.renderCenter()}
            </LinearGradient>
          </TouchableWithoutFeedback>
        </Animated.View>
    )
  }

  private renderCenter = () => {
    if (this.props.renderCenter) {
      return this.props.renderCenter()
    }
    return (
      <JSText bold={this.props.bold} style={[styles.text, this.props.textStyle]}>
        {this.props.label}
      </JSText>
    )
  }

  private getColors = () => {

    if (this.props.colors && this.props.colors.length > 0) {
      if (this.props.colors.length >= 2) {
        return this.props.colors.slice(0, 2)
      }
      return [this.props.colors[0], this.props.colors[0]]
    }

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

  private onPressIn = (e: GestureResponderEvent) => {
    this.state.scale.setValue(0.5)
    this.changeScale(true)
    this.props.onPressIn && this.props.onPressIn(e)
  }

  private onPressOut = (e: GestureResponderEvent) => {
    this.changeScale(false)
    this.props.onPressOut && this.props.onPressOut(e)
  }

  private changeScale = (shrink: boolean) => {
    this.state.scale.stopAnimation()
    Animated.timing(
      this.state.scale,
      {
        toValue: shrink ? 0 : 1,
        duration: 100,
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
