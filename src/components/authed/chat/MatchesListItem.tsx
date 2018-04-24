import React, { PureComponent } from 'react'
import { Dimensions, StyleSheet, TouchableWithoutFeedback, View, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { JSText, JSImage } from '../../common'

interface Props {
  name: string
  onPress: () => void
  lastMessage: string
  newMatch: boolean
  messageRead: boolean
  avatar: string
}

interface State {
  pressedIn: boolean
}

const WIDTH = Dimensions.get('window').width

class MatchesListItem extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      pressedIn: false,
    }
  }

  public render() {
    return (
    <View style={styles.container}>
      {this.props.messageRead && !this.props.newMatch ? this.renderItem() : this.renderUnreadItem()}
    </View>
    )
  }

  private renderItem(unread = false) {

    const messagePreviewTextStyle = [
      styles.messagePreview,
      unread ? styles.unreadText : styles.readText,
    ]
    const containerStyle = [styles.itemContainer]

    let preview = this.props.lastMessage
    if (this.props.newMatch) {
      unread = false
      preview = 'New Match💞'
      messagePreviewTextStyle.push(styles.pink)
    } else if (this.state.pressedIn && !unread) {
      containerStyle.push(styles.lightGray)
    }

    let avatarContainerShadow
    if (this.props.newMatch || unread) {
      avatarContainerShadow =  Platform.select({
        ios: {
          shadowRadius: 5,
          shadowColor: this.props.newMatch ? 'rgb(220,95,95)' : '#97B1D3',
          shadowOpacity: 0.4,
          shadowOffset: {
            height: 0,
            width: 0,
          },
        },
      })
    }

    return (
      <TouchableWithoutFeedback
        onPressIn={this.onPressIn}
        onPressOut={this.onPressOut}
        onPress={this.props.onPress}
      >
        <View style={containerStyle}>
          <View style={[styles.avatarContainer, avatarContainerShadow]}>
            <JSImage cache source={{uri: this.props.avatar}} style={styles.avatarPhoto} />
          </View>
          <View style={styles.textContainer}>
            <JSText style={styles.nameText}>{this.props.name}</JSText>
            <JSText numberOfLines={1} bold={unread} style={messagePreviewTextStyle}>
              {preview}
            </JSText>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  private renderUnreadItem() {
    const colors = this.props.newMatch ? [
      'rgb(253, 244, 243)',
      `rgba(250, 214, 214, ${this.state.pressedIn ? 1 : 0.4})`,
    ] : [
      'rgb(251, 252, 255)',
      `rgba(211, 227, 251, ${this.state.pressedIn ? 1 : 0.3})`,
    ]

    return (
      <LinearGradient
        colors={colors}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 1}}
        locations={[0, 1]}
        style={styles.gradient}
      >
        {this.renderItem(true)}
      </LinearGradient>
    )
  }

  private onPressIn = () => this.setState({ pressedIn: true })
  private onPressOut = () => this.setState({ pressedIn: false })

}

export default MatchesListItem

const styles = StyleSheet.create({
  container: {
    marginVertical: 1,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 15,
  },
  gradient: {
    borderRadius: 7,
  },
  nameText: {
    color: '#474747',
    fontSize: 15,
  },
  readText: {
    color: 'gray',
  },
  unreadText: {
    color: 'rgb(46, 64, 90)',
  },
  avatarContainer: {
    marginRight: 15,
    borderRadius: WIDTH / 9,
  },
  avatarPhoto: {
    width: WIDTH / 4.5,
    height: WIDTH / 4.5,
    borderRadius: WIDTH / 9,
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  pink: {
    color: '#EBA4A2',
  },
  lightGray: {
    backgroundColor: 'lightgray',
  },
  messagePreview: {
    fontSize: 15,
  },
})
