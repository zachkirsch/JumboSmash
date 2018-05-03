import React, { PureComponent } from 'react'
import { Animated, Easing, Platform, StyleSheet, TouchableWithoutFeedback } from 'react-native'

interface Props {
  IconClass: any /* tslint:disable-line:no-any */
  iconName: string
  iconColor: string
  iconSize: number
  onPress: () => void
  style?: any /* tslint:disable-line:no-any */
  rotate?: boolean
  disabled?: boolean
}

interface State {
  buttonPressedIn: boolean
  angle: Animated.Value
}

class CircleButton extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      buttonPressedIn: false,
      angle: new Animated.Value(0),
    }
  }

  componentWillMount() {
    this.rotate()
  }

  render() {

    const clickedButtonStyle = {
      backgroundColor: '#ACCBEE',
      borderWidth: 0,
    }

    const iconStyle = {
      marginTop: this.props.iconSize / 10,
      backgroundColor: 'transparent',
    }

    const rotateStyle = this.props.rotate && {
      transform: [
        {
          rotate: this.state.angle.interpolate(
            {
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg'],
            }
          ),
        },
      ],
    }

    const containerStyle = [
      styles.button,
      this.state.buttonPressedIn ? clickedButtonStyle : {},
      this.props.style,
      rotateStyle,
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
            color={this.state.buttonPressedIn ? 'white' : this.props.iconColor}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }

  private rotate = () => {
    this.state.angle.setValue(0)
    Animated.timing(this.state.angle, {
      toValue:  1,
      duration: 1500,
      easing: Easing.linear,
    }).start(this.rotate)
  }

  private onPressIn = () => this.setState({buttonPressedIn: true})
  private onPressOut = () => this.setState({buttonPressedIn: false})
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
        shadowColor: 'rgb(0, 0, 0)',
        shadowRadius: 5,
        shadowOpacity: 0.1,
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
