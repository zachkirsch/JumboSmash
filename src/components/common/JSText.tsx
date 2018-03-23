import React, { PureComponent } from 'react'
import { StyleSheet, Text, TextProperties } from 'react-native'
import { DEFAULT_FONT_SIZE } from './scaling'

interface Props extends TextProperties {
  style?: any /* tslint:disable-line:no-any */
  bold?: boolean
  fontSize?: number
}

export type JSTextProps = Props

class JSText extends PureComponent<Props, {}> {
  public render() {
    const { style, bold, fontSize, ...otherProps } = this.props

    const textStyles: any[] = [styles.default] /* tslint:disable-line:no-any */
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
    fontWeight: '300',
    fontFamily: 'Avenir',
    color: 'black',
    backgroundColor: 'transparent',
  },
  bold: {
    fontFamily: 'Avenir-Heavy',
    fontWeight: '800',
  },
})