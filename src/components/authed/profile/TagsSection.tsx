import React, { PureComponent } from 'react'
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { JSText } from '../../common'

interface Tag {
  name: string
  emoji?: boolean
  selected?: boolean
}

interface Props {
  tags: Tag[]
  onPress?: (tagIndex: number) => void
  fontSize?: number
  tagStyle?: TextStyle
  selectedTagStyle?: TextStyle
  unselectedTagStyle?: TextStyle
  containerStyle?: ViewStyle
  alignLeft?: boolean
}

class TagsSection extends PureComponent<Props, {}> {

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
          onPress={this.props.onPress && (() => this.props.onPress && this.props.onPress(tagIndex))}
          key={tag.name}
        >
          {tag.name}
        </JSText>
      )
    })

    const containerStyle = [
      styles.container,
      this.props.alignLeft ? styles.flexStart : styles.spaceBetween,
      this.props.containerStyle,
    ]

    return (
      <View style={containerStyle}>
        {toRender}
        <View style={styles.lastLine} />
      </View>
    )
  }
}

export default TagsSection

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  flexStart: {
    justifyContent: 'flex-start',
  },
  spaceBetween: {
    justifyContent: 'space-between',
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
