import React, { PureComponent } from 'react'
import { StyleSheet, TouchableOpacity, TouchableOpacityProperties } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import JSText from './JSText'

interface Props extends TouchableOpacityProperties {
  containerStyle?: any /* tslint:disable-line:no-any */
  colors?: string[] // two colors for the gradient
  label: string
}

export type JSButtonProps = Props

class JSButton extends PureComponent<Props, {}> {

  public render() {

    const {label, style, ...otherProps} = this.props

    return (
      <LinearGradient
        colors={this.props.colors || ['rgba(231,240,253,0.67)', 'rgba(172,203,238,0.47)']}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 1}}
        locations={[0, 1]}
        style={[styles.container, this.props.containerStyle]}
      >
        <TouchableOpacity
          style={[styles.button, style]}
          {...otherProps}
        >
          <JSText style={styles.text}>
            {label}
          </JSText>
        </TouchableOpacity>
      </LinearGradient>
    )
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
    alignSelf: 'center',
  },
  text: {
    fontSize: 14,
    lineHeight: 19,
    backgroundColor: 'transparent',
    fontFamily: 'Avenir',
    marginVertical: 5,
    color: '#4A4A4A',

  },
})
