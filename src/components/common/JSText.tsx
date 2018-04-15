import React, { PureComponent } from 'react'
import { StyleSheet, Text, TextProperties } from 'react-native'
import { DEFAULT_FONT_SIZE } from './scaling'

interface Props extends TextProperties {
  style?: any /* tslint:disable-line:no-any */
  semibold?: boolean
  bold?: boolean
  fontSize?: number
}

export type JSTextProps = Props

class JSText extends PureComponent<Props, {}> {
  public render() {
    const { style, bold, semibold, fontSize, ...otherProps } = this.props

    const textStyles: any[] = [styles.default] /* tslint:disable-line:no-any */
    if (semibold) {
      textStyles.push(styles.semibold)
    }
    if (bold) {
      textStyles.push(styles.bold)
    }
    textStyles.push(style)
    textStyles.push({
      fontSize: fontSize || DEFAULT_FONT_SIZE,
    })

    return <Text style={textStyles} {...otherProps} />
  }
}

export default JSText

const styles = StyleSheet.create({
  default: {
    fontFamily: 'Avenir-Book',
    color: 'black',
    backgroundColor: 'transparent',
  },
  semibold: {
    fontFamily: 'Avenir-Medium',
  },
  bold: {
    fontFamily: 'Avenir-Heavy',
  },
})
