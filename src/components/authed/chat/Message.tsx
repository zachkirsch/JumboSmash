import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import { MessageProps, utils } from 'react-native-gifted-chat'
import Bubble from './Bubble'
import LinearGradient from 'react-native-linear-gradient'
import JSText from '../../common/JSText'
import moment from 'moment'
import { User } from '../../../services/swipe'
import { JSImage } from '../../common'

interface Props extends MessageProps {
  fromUser?: User
}

const { isSameUser } = utils

const DEFAULT_DATE_FORMAT = 'MMMM D [at] h[:]mm A'

export default class Message extends PureComponent<Props, {}> {

  renderDay() {

    if (this.props.currentMessage === undefined || !this.shouldShowDate()) {
      return null
    }

    const currCreated = moment(this.props.currentMessage.createdAt)
    const formattedDate = currCreated.calendar(undefined, {
      sameDay: '[Today at] h[:]mm A',
      lastDay: '[Yesterday at] h[:]mm A',
      nextDay: DEFAULT_DATE_FORMAT,
      nextWeek: DEFAULT_DATE_FORMAT,
      lastWeek: DEFAULT_DATE_FORMAT,
      sameElse: DEFAULT_DATE_FORMAT,
    })

    return (
      <JSText style={styles.date}>
        {formattedDate}
      </JSText>
    )
  }

  renderBubble() {
    if (!this.props.user) {
      return null
    }
    return (
      <Bubble
        currentMessage={this.props.currentMessage}
        user={this.props.user}
      />
    )
  }

  renderAvatar() {

    if (!this.props.currentMessage || !this.props.user) {
      return null
    }

    // only show avatar for other users
    if (this.props.currentMessage.system || this.props.currentMessage.user._id === this.props.user._id) {
      return null
    }

    if (!this.props.fromUser) {
      return <View style={[styles.avatar, styles.transparent]} />
    }

    return (
      <JSImage
        cache
        source={{ uri: this.props.fromUser.images[0] }}
        style={styles.avatar}
      />
    )
  }

  renderFailedToSend() {
    if (!this.props.currentMessage || this.props.currentMessage.system || !this.props.currentMessage.failedToSend) {
      return null
    }
    return (
      <View style={styles.failedToSendMessage}>
        <JSText style={styles.failedToSendText}>Oops, failed to send. Try again</JSText>
      </View>
    )
  }

  render() {
    if (!this.props.currentMessage || this.props.currentMessage.system || !this.props.user) {
      return null
    }

    const marginBottom = isSameUser(this.props.currentMessage, this.props.nextMessage) ? 2 : 10

    const colors = [
      'rgba(232, 240, 252, 0.35)',
      this.props.currentMessage.user._id === this.props.user._id
        ? 'rgba(212, 214, 219, 0.35)'
        : 'rgba(176, 201, 240, 0.35)',
    ]

    const containerStyle = this.props.position && styles[this.props.position]

    return (
      <View>
        {this.renderDay()}
        <View style={[styles.container, { marginBottom }, containerStyle]}>
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
        {this.renderFailedToSend()}
      </View>
    )
  }

  private shouldShowDate = () => {
    if (!this.props.currentMessage) {
      return false
    } else if (this.props.previousMessage) {
      const currCreated = moment(this.props.currentMessage.createdAt)
      const prevCreated = moment(this.props.previousMessage.createdAt)
      return moment.duration(currCreated.diff(prevCreated)).asHours() > 1
    } else {
      return true
    }
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
  avatar: {
    // The bottom should roughly line up with the first line of message text.
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    marginBottom: 5,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  date: {
    fontSize: 10,
    marginVertical: 15,
    textAlign: 'center',
    color: 'gray',
  },
  failedToSendMessage: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  failedToSendText: {
    color: 'rgb(214, 145, 145)',
  }
})
