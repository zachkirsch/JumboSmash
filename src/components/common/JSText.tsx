import React, { PureComponent } from 'react'
import { StyleSheet, Text, TextProperties } from 'react-native'

interface Props extends TextProperties {
  style?: any /* tslint:disable-line:no-any */
  semibold?: boolean
  bold?: boolean
}

export type JSTextProps = Props

class JSText extends PureComponent<Props, {}> {
  public render() {
    const { style, bold, semibold, ...otherProps } = this.props

    const textStyles: any[] = [styles.default] /* tslint:disable-line:no-any */
    if (semibold) {
      textStyles.push(styles.semibold)
    }
    if (bold) {
      textStyles.push(styles.bold)
    }
    textStyles.push(style)

    return <Text style={textStyles} {...otherProps} />
  }
}

export default JSText

const styles = StyleSheet.create({
  default: {
    fontFamily: 'ProximaNovaSoft-Regular',
    color: 'black',
    backgroundColor: 'transparent',
  },
  semibold: {
    fontFamily: 'ProximaNovaSoft-Medium',
  },
  bold: {
    fontFamily: 'ProximaNovaSoft-SemiBold',
  },
})
