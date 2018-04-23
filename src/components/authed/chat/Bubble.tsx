import React, { PureComponent } from 'react'
import { Clipboard, StyleSheet, View, TouchableOpacity } from 'react-native'
import { BubbleProps } from 'react-native-gifted-chat'
import { connectActionSheet, ActionSheetProps } from '@expo/react-native-action-sheet'
import { JSText } from '../../common'
import { generateActionSheetOptions } from '../../../utils'

type Props = ActionSheetProps<BubbleProps>

@connectActionSheet
class Bubble extends PureComponent<Props, {}> {

  render() {
    if (!this.props.currentMessage) {
      return null
    }
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.onPress}>
          <View style={styles.wrapper}>
            <View>
              {this.renderMessageText()}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  private onPress = () => {
    if (this.props.currentMessage && this.props.currentMessage.text) {
      const text = this.props.currentMessage.text
      const { options, callback } = generateActionSheetOptions([
        {
          title: 'Copy Message',
          onPress: () => Clipboard.setString(text),
        },
      ])
      this.props.showActionSheetWithOptions!(options, callback)
    }
  }

  private renderMessageText = () => {
    if (this.props.currentMessage) {
      return (
        <JSText style={styles.slackMessageText} fontSize={15}>
          {this.props.currentMessage.text}
        </JSText>
      )
    }
    return null
  }

}

export default Bubble

const styles = StyleSheet.create({
  slackMessageText: {
    marginLeft: 14,
    marginRight: 0,
    marginTop: 5,
    marginBottom: 5,
    color: '#2F2E2E',
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    minHeight: 40,
    paddingVertical: 5,
  },
  wrapper: {
    marginRight: 14,
    minHeight: 20,
    justifyContent: 'flex-end',
  },
})
