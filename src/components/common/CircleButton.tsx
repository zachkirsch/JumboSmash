import React, { PureComponent } from 'react'
import { ViewStyle, Image, Animated, Easing, Platform, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { getMainColor } from '../../utils'

interface IconProps {
  type: 'icon'
  IconClass: any /* tslint:disable-line:no-any */
  iconName: string
  iconColor: string
  iconSize: number
  rotate?: boolean
  style?: any /* tslint:disable-line:no-any */
}

interface ImageProps {
  type: 'image'
  source: number
  containerStyle?: any /* tslint:disable-line:no-any */
  imageStyle?: ViewStyle
}

type Props = (IconProps | ImageProps) & {
  onPress: () => void
  disabled?: boolean
}

interface State {
  buttonPressedIn: boolean
  angle: Animated.Value
  scale: Animated.Value
}

class CircleButton extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      buttonPressedIn: false,
      angle: new Animated.Value(0),
      scale: new Animated.Value(1),
    }
  }

  componentWillMount() {
    this.rotate()
  }

  render() {
    if (this.props.type === 'icon') {
      return this.renderIcon()
    } else if (this.props.type === 'image') {
      return this.renderImage()
    }
    return null
  }

  private renderIcon = () => {

    if (this.props.type !== 'icon') {
      return null
    }

    const iconStyle = {
      marginTop: this.props.iconSize / 10,
      backgroundColor: 'transparent',
    }

    const transforms = this.getScaleStyle()
    if (this.props.rotate) {
      transforms.push({
        rotate: this.state.angle.interpolate(
          {
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
          }
        ),
      } as any) /* tslint:disable-line:no-any */
    }

    const containerStyle = [
      styles.button,
      this.props.style,
      {
        transform: transforms,
      },
    ]

    return (
      <TouchableWithoutFeedback
        onPress={this.props.onPress}
        onPressIn={this.onPressIn}
        onPressOut={this.onPressOut}
        disabled={this.props.disabled}
      >
        <Animated.View style={containerStyle}>
          <this.props.IconClass
            style={iconStyle}
            name={this.props.iconName}
            size={this.props.iconSize}
            color={this.props.iconColor}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }

  private renderImage = () => {
    if (this.props.type !== 'image') {
      return null
    }
    const containerStyle = [
      styles.button,
      this.props.containerStyle,
      {
        transform: this.getScaleStyle(),
      },
    ]
    return (
      <TouchableWithoutFeedback
        onPress={this.props.onPress}
        onPressIn={this.onPressIn}
        onPressOut={this.onPressOut}
        disabled={this.props.disabled}
      >
        <Animated.View style={containerStyle}>
          <Image resizeMode='contain' source={this.props.source} style={this.props.imageStyle} />
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }

  private getScaleStyle = () => {
    return [
      {
        scaleX: this.state.scale.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
        }),
      },
      {
        scaleY: this.state.scale.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
        }),
      },
    ]
  }

  private rotate = () => {
    this.state.angle.setValue(0)
    Animated.timing(this.state.angle, {
      toValue:  1,
      duration: 1500,
      easing: Easing.linear,
    }).start(this.rotate)
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
        duration: 100,
      }
    ).start()
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 25,
    height: 60,
    width: 60,
    borderRadius: 60,
    ...Platform.select({
      ios: {
        shadowColor: getMainColor(),
        shadowRadius: 5,
        shadowOpacity: 0.25,
        shadowOffset: {
          width: 0,
          height: 0,
        },
      },
    }),
    ...Platform.select({
      android: {
        elevation: 3,
      },
    }),
  },
})

export default CircleButton
export { Props as CircleButtonProps }
