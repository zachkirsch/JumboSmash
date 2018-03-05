import React, { PureComponent } from 'react'
import { Animated, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import { moderateScale } from '../../generic'

interface Props {
  IconClass: any /* tslint:disable-line:no-any */
  iconName: string
  iconColor: string
  iconSize: number
  onPress: () => void
  style?: any /* tslint:disable-line:no-any */
}

interface State {
  buttonPressedIn: boolean
}

class CircleButton extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      buttonPressedIn: false,
    }
  }

  render() {

    const clickedButtonStyle = {
      backgroundColor: '#ACCBEE',
      borderWidth: 0,
    }

    return (
      <TouchableWithoutFeedback
        onPress={this.props.onPress}
        onPressIn={() => this.setState({buttonPressedIn: true})}
        onPressOut={() => this.setState({buttonPressedIn: false})}>
        <Animated.View style={[styles.button, this.state.buttonPressedIn ? clickedButtonStyle : {}, this.props.style]}>
          <this.props.IconClass
            style={styles.icon}
            name={this.props.iconName}
            size={this.props.iconSize}
            color={this.state.buttonPressedIn ? 'white' : this.props.iconColor}
          />

        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(67, 80, 93, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 25,
    height: 60,
    width: 60,
    borderRadius: 60,
    shadowColor: 'rgb(0, 0, 0)',
    shadowRadius: 5,
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 0},
    elevation: 3,
  },
  icon: {
    marginTop: moderateScale(3),
    backgroundColor: 'transparent',
  },
})

export default CircleButton
export { Props as CircleButtonProps }