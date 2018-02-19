import React, { PureComponent } from 'react'
import { Text, TextProperties, StyleSheet, TextStyle } from 'react-native'
import { scale, DEFAULT_FONT_SIZE } from './scaling'

interface Props extends TextProperties {
  style?: TextStyle | TextStyle[]
  bold?: boolean
  fontSize?: number
}

class JSText extends PureComponent<Props, {}> {
  public render() {
    const { style, bold, fontSize, ...otherProps } = this.props

    const textStyles: any[] = [styles.default] /* tslint:disable-line:no-any */
    if (bold) {
      textStyles.push(styles.bold)
    }
    textStyles.push(style)
    textStyles.push({
      fontSize: scale(fontSize || DEFAULT_FONT_SIZE),
    })

    return <Text style={textStyles} {...otherProps} />
  }
}

export default JSText

const styles = StyleSheet.create({
  default: {
    fontWeight: '300',
    fontFamily: 'Avenir',
    fontSize: 25,
    color: 'black',
  },
  bold: {
    fontFamily: 'Avenir-Heavy',
    fontWeight: '800',
  },
})
