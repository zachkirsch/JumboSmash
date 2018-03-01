import React, { PureComponent, Component, ComponentState } from 'react'
import { TextInput, TextInputProperties, StyleSheet, TextInputStatic, TextStyle, Platform } from 'react-native'
import { DEFAULT_FONT_SIZE } from './scaling'

export type TextInputRef = TextInputStatic & Component<TextInputProperties, ComponentState>

interface Props extends TextInputProperties {
  style?: TextStyle | TextStyle[]
  textInputRef?: (instance: TextInputRef) => void
  fontSize?: number
}

interface State {
  showPlaceholder: boolean
}

class JSTextInput extends PureComponent<Props, State> {

  public constructor(props: Props) {
    super(props)
    this.state = {
      showPlaceholder: true,
    }
  }

  public render() {

    const { textInputRef, placeholder, style, fontSize, ...otherProps } = this.props

    const textInputStyles: any[] = [styles.input] /* tslint:disable-line:no-any */
    textInputStyles.push(style)
    textInputStyles.push({
      fontSize: fontSize || DEFAULT_FONT_SIZE,
    })

    return (
      <TextInput
        {...otherProps}
        ref={textInputRef}
        style={textInputStyles}
        placeholder={this.state.showPlaceholder ? placeholder : undefined}
        onFocus={() => {
          this.setState({
            showPlaceholder: Platform.OS === 'android',
          })
          this.props.onFocus && this.props.onFocus()
        }}
        onBlur={() => {
          this.setState({
            showPlaceholder: true,
          })
          this.props.onBlur && this.props.onBlur()
        }}
      />
    )
  }
}

export default JSTextInput

const styles = StyleSheet.create({
  input: {
    shadowColor: 'rgba(172, 203, 238, 0.75)',
    shadowOpacity: 1,
    shadowRadius: 50,
    marginVertical: 5,
    marginHorizontal: 45,
    paddingVertical: 15,
    fontSize: 15,
    fontWeight: '300',
    fontFamily: 'Avenir',
    textAlign: 'center',
  },
})
