import React, { PureComponent, Component, ComponentState } from 'react'
import { TextInput, TextInputProperties, StyleSheet, TextInputStatic, TextStyle, Platform } from 'react-native'
import { DEFAULT_FONT_SIZE } from './scaling'

export type TextInputRef = TextInputStatic & Component<TextInputProperties, ComponentState>

interface Props extends TextInputProperties {
  style?: TextStyle | TextStyle[]
  textInputRef?: (instance: TextInputRef) => void
  fontSize?: number
  fancy?: boolean // takes up more space, text is centered, has shadow on IOS. defaults to false
  underline?: boolean // iOS only. defaults to opposite of fancy
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
    if (this.props.fancy) {
      textInputStyles.push(styles.fancy)
    }
    const shouldUnderline = this.props.underline === undefined ? !this.props.fancy : this.props.underline
    if (Platform.OS === 'ios' && shouldUnderline) {
      textInputStyles.push(styles.underline)
    }

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
    fontSize: 15,
    fontWeight: '300',
    fontFamily: 'Avenir',
  },
  fancy: {
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(172, 203, 238, 0.75)',
        shadowOpacity: 1,
        shadowRadius: 50,
      },
    }),
    marginVertical: 5,
    paddingVertical: 15,
    textAlign: 'center',
  },
  underline: {
    borderBottomColor: '#D5DCE2',
    borderBottomWidth: 1,
  },
})
