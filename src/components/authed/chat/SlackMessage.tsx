/* eslint-disable no-underscore-dangle, no-use-before-define */

import React from 'react';
import {
  View,
  ViewPropTypes,
  StyleSheet,
} from 'react-native';

import { Avatar, Day, Time, utils } from 'react-native-gifted-chat';
import Bubble from './SlackBubble';
import LinearGradient from 'react-native-linear-gradient'
import JSText from "../../common/JSText";
import moment from 'moment'

const { isSameUser, isSameDay } = utils;

export default class Message extends React.Component {

  getInnerComponentProps() {
    const { containerStyle, ...props } = this.props;
    return {
      ...props,
      // position: 'left',
      isSameUser,
      isSameDay,
    };
  }

  renderDay() {
    let shouldShow = false
    const currCreated = moment(this.props.currentMessage.createdAt)

    if (this.props.previousMessage) {
      const prevCreated = moment(this.props.previousMessage.createdAt)
      shouldShow = moment.duration(currCreated.diff(prevCreated)).asHours() > 1
    } else {
      shouldShow = true
    }

    if (!shouldShow) {
      return null
    }

    const formattedDate = currCreated.calendar(null, {

      sameDay: '[Today at] h[:]mm A',
      nextDay: 'MMMM D [at] h[:]mm A',
      nextWeek: 'MMMM D [at] h[:]mm A',
      lastDay: '[Yesterday at] h[:]mm A',
      lastWeek: 'MMMM D [at] h[:]mm A',
      sameElse: 'MMMM D [at] h[:]mm A'
    });
    // console.log(moment.duration(currCreated.diff(prevCreated)).asHours(), this.props.previousMessage.createdAt,
    //   this.props.currentMessage.createdAt)
    return (
      <JSText style={{marginVertical: 15, textAlign: 'center', color: 'gray',}} fontSize={10}>
        {formattedDate}
      </JSText>
    )
    // if (this.props.currentMessage.createdAt) {
    //   const dayProps = this.getInnerComponentProps();
    //   if (this.props.renderDay) {
    //     return this.props.renderDay(dayProps);
    //   }
    //   return <Day {...dayProps} />;
    // }
    // return null;
  }

  renderTime() {
    return null;
    if (this.props.currentMessage.createdAt) {
      const timeProps = this.getInnerComponentProps();
      if (this.props.renderTime) {
        return this.props.renderTime(timeProps);
      }
      return <Time {...timeProps} />;
    }
    return null;
  }

  renderBubble() {
    const bubbleProps = this.getInnerComponentProps();
    if (this.props.renderBubble) {
      return this.props.renderBubble(bubbleProps);
    }
    return <Bubble {...bubbleProps} />;
  }

  renderAvatar() {
    if (this.props.currentMessage.user._id == this.props.user._id) {
      return null;
    }
    let extraStyle;
    if (
      isSameUser(this.props.currentMessage, this.props.previousMessage)
      && isSameDay(this.props.currentMessage, this.props.previousMessage)
    ) {
      // Set the invisible avatar height to 0, but keep the width, padding, etc.
      extraStyle = { height: 0 };
    }

    const avatarProps = this.getInnerComponentProps();
    return (
      <Avatar
        {...avatarProps}
        imageStyle={{ left: [styles.slackAvatar, avatarProps.imageStyle, extraStyle] }}
      />
    );
  }

  render() {
    const marginBottom = isSameUser(this.props.currentMessage, this.props.nextMessage) ? 2 : 10;

    const colors = this.props.currentMessage.user._id == this.props.user._id ? [
      `rgba(232, 240, 252, ${0.35})`,
      `rgba(212, 214, 219, ${0.35})`,
    ] : [
      `rgba(232, 240, 252, ${0.35})`,
      `rgba(176, 201, 240, ${0.35})`,
    ]

    const containerStyle = this.props.position == 'left' ? styles.left : styles.right

    return (
      <View>
        {this.renderDay()}
        {this.renderTime()}
        <View
          style={[
            styles.container,
            { marginBottom },
            this.props.containerStyle,
            containerStyle,
          ]}
        >
          {this.renderAvatar()}
          <LinearGradient
            colors={colors}
            start={{x: 0, y: 1}}
            end={{x: 1, y: 1}}
            locations={[0, 1]}
            style={styles.gradient}
          >
            {this.renderBubble()}
          </LinearGradient>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginLeft: 8,
    marginRight: 8,
    marginVertical: 6,
  },
  gradient: {
    borderRadius: 30,
  },
  left: {
    marginRight: 100,

  },
  right: {
    marginLeft: 100,
    justifyContent: 'flex-end',
  },
  slackAvatar: {
    // The bottom should roughly line up with the first line of message text.
    height: 40,
    width: 40,
    borderRadius: 20,
  },
});