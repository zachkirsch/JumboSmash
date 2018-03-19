import React, { PureComponent } from 'react'
import { View, TouchableWithoutFeedback, Image, StyleSheet, Dimensions } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { JSText } from '../../generic'

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
      {this.props.messageRead && !this.props.newMatch
        ? this.renderItem(false)
        : this.renderUnreadItem()
      }
    </View>
    )
  }

  private renderItem(unread: boolean) {

    const textStyle = [unread ? styles.unreadText : styles.readText]

    let preview = this.props.lastMessage
    if (this.props.newMatch) {
      unread = true
      preview = 'New Match!'
      textStyle.push(styles.blue)
    }

    const containerStyle = [styles.match]
    if (this.state.pressedIn && !unread) {
      containerStyle.push(styles.lightGray)
    }

    return (
      <TouchableWithoutFeedback
        onPressIn={() => this.setState({ pressedIn: true })}
        onPressOut={() => this.setState({ pressedIn: false })}
        onPress={this.props.onPress}
      >
        <View style={containerStyle}>
        <Image source={{uri: this.props.avatar}} style={styles.avatarPhoto} />
        <View style={styles.textContainer}>
          <JSText style={styles.nameText}>{this.props.name}</JSText>
          <JSText numberOfLines={1} bold={unread} style={textStyle}>{preview}</JSText>
        </View>
      </View>
      </TouchableWithoutFeedback>
    )
  }

  private renderUnreadItem() {

    let opacities = [0.4, 0.2]

    if (this.props.newMatch) {
      opacities = opacities.map(opacity => 0.5 + opacity / 2)
    }
    if (this.state.pressedIn) {
      opacities = opacities.map(opacity => 0.5 + opacity / 2)
    }

    const colors = [
      `rgba(231, 240, 253, ${opacities[0]})`,
      `rgba(177, 202, 239, ${opacities[1]})`,
    ]

    return (
      <LinearGradient
        colors={colors}
        start={{x: 0, y: 1}} end={{x: 1, y: 1}}
        locations={[0, 1]}
        style={styles.gradient}
      >
        {this.renderItem(true)}
      </LinearGradient>
    )
  }

}

export default MatchesListItem

const styles = StyleSheet.create({
  container: {
    marginVertical: 1,
  },
  gradient: {
    borderRadius: 7,
  },
  match: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 15,
  },
  nameText: {
    color: 'black',
  },
  readText: {
    color: 'gray',
  },
  unreadText: {
    color: 'rgb(46, 64, 90)',
  },
  avatarPhoto: {
    marginRight: 15,
    width: WIDTH / 4.5,
    height: WIDTH / 4.5,
    borderRadius: WIDTH / 9,
  },
  textContainer: {
    flexDirection: 'column',
    flex: .9,
    justifyContent: 'center',
  },
  blue: {
    color: 'blue',
  },
  lightGray: {
    backgroundColor: 'lightgray',
  },
})
