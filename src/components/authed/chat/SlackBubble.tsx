/* eslint-disable no-underscore-dangle, no-use-before-define */

import React from 'react';
import {
  Text,
  Clipboard,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewPropTypes,
  Platform,
} from 'react-native';

import { MessageText, MessageImage, Time, utils } from 'react-native-gifted-chat';
import JSText from "../../common/JSText";

const { isSameUser, isSameDay } = utils;

export default class Bubble extends React.Component {

  constructor(props) {
    super(props);
    this.onLongPress = this.onLongPress.bind(this);
  }

  onLongPress() {
    if (this.props.onLongPress) {
      this.props.onLongPress(this.context);
    } else if (this.props.currentMessage.text) {
      const options = [
        'Copy Text',
        'Cancel',
      ];
      const cancelButtonIndex = options.length - 1;
      this.context.actionSheet().showActionSheetWithOptions(
        { options, cancelButtonIndex },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            Clipboard.setString(this.props.currentMessage.text);
          }
        });
    }
  }

  renderMessageText() {
    if (this.props.currentMessage.text) {
      return (
        <JSText style={[styles.standardFont, styles.slackMessageText]} fontSize={15}>
          {this.props.currentMessage.text}
        </JSText>
      )
    }
    return null;
  }

  renderMessageImage() {
    if (this.props.currentMessage.image) {
      const { containerStyle, wrapperStyle, ...messageImageProps } = this.props;
      if (this.props.renderMessageImage) {
        return this.props.renderMessageImage(messageImageProps);
      }
      return <MessageImage {...messageImageProps} imageStyle={[styles.slackImage, messageImageProps.imageStyle]} />;
    }
    return null;
  }

  renderTicks() {
    const { currentMessage } = this.props;
    if (this.props.renderTicks) {
      return this.props.renderTicks(currentMessage);
    }
    if (currentMessage.user._id !== this.props.user._id) {
      return null;
    }
    if (currentMessage.sent || currentMessage.received) {
      return (
        <View style={[styles.headerItem, styles.tickView]}>
          {currentMessage.sent && <Text style={[styles.standardFont, styles.tick, this.props.tickStyle]}>✓</Text>}
          {currentMessage.received && <Text style={[styles.standardFont, styles.tick, this.props.tickStyle]}>✓</Text>}
        </View>
      );
    }
    return null;
  }

  renderCustomView() {
    if (this.props.renderCustomView) {
      return this.props.renderCustomView(this.props);
    }
    return null;
  }

  render() {
    const isSameThread = isSameUser(this.props.currentMessage, this.props.previousMessage)
      && isSameDay(this.props.currentMessage, this.props.previousMessage);

    const messageHeader = null
    // const messageHeader = isSameThread ? null : (
    //   <View style={styles.headerView}>
    //     {this.renderTicks()}
    //   </View>
    // );

    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <View
          style={[
            styles.wrapper,
            this.props.wrapperStyle,
          ]}
        >
          <View>
            {this.renderCustomView()}
            {messageHeader}
            {this.renderMessageImage()}
            {this.renderMessageText()}
          </View>
        </View>
      </View>
    );
  }

}

// Note: Everything is forced to be "left" positioned with this component.
// The "right" position is only used in the default Bubble.
const styles = StyleSheet.create({
  standardFont: {
    fontSize: 15,
  },
  slackMessageText: {
    marginLeft: 14,
    marginRight: 0,
    marginTop: 5,
    marginBottom: 5,
    color: '#2F2E2E',
    // backgroundColor: 'green',
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    minHeight: 40,
    paddingVertical: 5,
    // backgroundColor: 'yellow',
  },
  wrapper: {
    marginRight: 14,
    minHeight: 20,
    justifyContent: 'flex-end',
  },
  username: {
    fontWeight: 'bold',
  },
  time: {
    textAlign: 'left',
    fontSize: 12,
  },
  timeContainer: {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
  headerItem: {
    marginRight: 10,
  },
  headerView: {
    // Try to align it better with the avatar on Android.
    marginTop: Platform.OS === 'android' ? -2 : 0,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  /* eslint-disable react-native/no-color-literals */
  tick: {
    backgroundColor: 'transparent',
    color: 'white',
  },
  /* eslint-enable react-native/no-color-literals */
  tickView: {
    flexDirection: 'row',
  },
  slackImage: {
    borderRadius: 3,
    marginLeft: 0,
    marginRight: 0,
  },
});