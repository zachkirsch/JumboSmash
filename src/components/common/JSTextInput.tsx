import React, { Component, ComponentState, PureComponent } from 'react'
import { Platform, StyleSheet, TextInput, TextInputProperties, TextInputStatic, TextStyle } from 'react-native'
import { getMainColor } from '../../utils'

export type TextInputRef = TextInputStatic & Component<TextInputProperties, ComponentState>

interface Props extends TextInputProperties {
  style?: TextStyle | TextStyle[]
  textInputRef?: (instance: TextInputRef) => void
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

    const { textInputRef, placeholder, style, multiline, ...otherProps } = this.props

    const textInputStyles: any[] = [styles.input] /* tslint:disable-line:no-any */
    if (this.props.fancy) {
      textInputStyles.push(styles.fancy)
    }
    const shouldUnderline = this.props.underline === undefined ? !this.props.fancy : this.props.underline
    if (shouldUnderline) {
      textInputStyles.push(styles.underline)
    }
    textInputStyles.push(style)

    textInputStyles.push(Platform.select({
      android: {
        textAlignVertical: multiline ? 'top' : 'center',
      },
    }))

    return (
      <TextInput
        {...otherProps}
        multiline={multiline}
        ref={textInputRef}
        style={textInputStyles}
        placeholder={this.state.showPlaceholder ? placeholder : undefined}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        underlineColorAndroid={'transparent'}
      />
    )
  }

  private onFocus = () => {
    this.setState({
      showPlaceholder: Platform.OS === 'android',
    })
    this.props.onFocus && this.props.onFocus()
  }

  private onBlur = () => {
    this.setState({
      showPlaceholder: true,
    })
    this.props.onBlur && this.props.onBlur()
  }
}

export default JSTextInput

const styles = StyleSheet.create({
  input: {
    fontFamily: 'ProximaNovaSoft-Regular',
    paddingVertical: 0,
  },
  fancy: {
    ...Platform.select({
      ios: {
        shadowColor: getMainColor(0.75),
        shadowOpacity: 1,
        shadowRadius: 50,
      },
      android: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'lightgray',
        elevation: 1,
      },
    }),
    marginVertical: 5,
    paddingVertical: 15,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  underline: {
    borderBottomColor: '#D5DCE2',
    borderBottomWidth: 1,
  },
})
