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
  tagStyle?: TextStyle
  emojiStyle?: TextStyle
  selectedTagStyle?: TextStyle
  unselectedTagStyle?: TextStyle
  containerStyle?: ViewStyle
}

class TagsSection extends PureComponent<Props, {}> {

  render() {
    const toRender = this.props.tags.map((tag, tagIndex) => {
      const textStyle: any = [styles.tag] /* tslint:disable-line:no-any */
      textStyle.push(this.props.tagStyle)
      if (!tag.emoji) {
        textStyle.push(styles.underline)
      } else {
        textStyle.push(this.props.emojiStyle)
      }
      textStyle.push(tag.selected ? this.props.selectedTagStyle : this.props.unselectedTagStyle)

      return (
        <JSText
          key={tag.name}
          onPress={this.props.onPress && (() => this.props.onPress && this.props.onPress(tagIndex))}
          style={textStyle}
        >
          {tag.name}
        </JSText>
      )
    })

    const containerStyle = [
      styles.container,
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
    justifyContent: 'flex-start',
  },
  lastLine: {
    flexGrow: 1,
  },
  tag: {
    color: '#29292C',
    paddingHorizontal: 8,
    paddingVertical: 1.5,
  },
  underline: {
    textDecorationLine: 'underline',
    textDecorationColor: '#D5DCE2',
  },
})
