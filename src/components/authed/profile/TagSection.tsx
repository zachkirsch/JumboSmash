import React, { PureComponent } from 'react'
import { StyleSheet, View, TextStyle, ViewStyle } from 'react-native'
import { Tag } from '../../../services/profile'
import { JSText } from '../../common'

interface Props {
  tags: Tag[]
  onPress?: (tagIndex: number) => void
  fontSize?: number
  tagStyle?: TextStyle
  selectedTagStyle?: TextStyle
  unselectedTagStyle?: TextStyle
  containerStyle?: ViewStyle
}

class TagSection extends PureComponent<Props, {}> {

  render() {
    const toRender = this.props.tags.map((tag, tagIndex) => {
      const textStyle: any = [styles.tag] /* tslint:disable-line:no-any */
      if (!tag.emoji) {
        textStyle.push(styles.underline)
      }
      textStyle.push(this.props.tagStyle)
      textStyle.push(tag.selected ? this.props.selectedTagStyle : this.props.unselectedTagStyle)
      return (
        <JSText
          style={textStyle}
          fontSize={this.props.fontSize}
          onPress={this.props.onPress && (() => this.props.onPress(tagIndex))}
          key={tag.name}
        >
          {tag.name}
        </JSText>
      )
    })

    return (
      <View style={[styles.container, this.props.containerStyle]}>
        {toRender}
        <View style={styles.lastLine} />
      </View>
    )
  }
}

export default TagSection

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  lastLine: {
    flexGrow: 1,
  },
  tag: {
    color: '#29292C',
    marginRight: 10,
  },
  underline: {
    textDecorationLine: 'underline',
    textDecorationColor: '#D5DCE2',
  },
})
