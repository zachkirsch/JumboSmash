import React, { PureComponent } from 'react'
import { Dimensions, Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { JSText } from '../../common'

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
      {this.props.messageRead && !this.props.newMatch ? this.renderItem(false) : this.renderUnreadItem()}
    </View>
    )
  }

  private renderItem(unread: boolean) {

    const textStyle = [unread ? styles.unreadText : styles.readText]

    let preview = this.props.lastMessage
    if (this.props.newMatch) {
      unread = true
      preview = 'New Match💞'
      textStyle.push(styles.pink)
    }

    const containerStyle = [styles.match]
    if (this.state.pressedIn && !unread) {
      containerStyle.push(styles.lightGray)
    }

    return (
      <TouchableWithoutFeedback
        onPressIn={this.onPressIn}
        onPressOut={this.onPressOut}
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

    let blueOpacity = [0.4, 0.2]
    let pinkOpacity = [0.02, 0.01]

    if (this.props.newMatch) {
      blueOpacity = blueOpacity.map((opacity) => 0.5 + opacity / 2)
      pinkOpacity = pinkOpacity.map((opacity) => 0.5 + opacity / 2)
    }
    if (this.state.pressedIn) {
      blueOpacity = blueOpacity.map((opacity) => 0.5 + opacity / 2)
      pinkOpacity = pinkOpacity.map((opacity) => 0.5 + opacity / 2)
    }

    const colors = this.props.newMatch ? [
      `rgba(250, 209, 196, ${pinkOpacity[0]})`,
      `rgba(219, 135, 140, ${pinkOpacity[1]})`,
    ] : [
      `rgba(231, 240, 253, ${blueOpacity[0]})`,
      `rgba(177, 202, 239, ${blueOpacity[1]})`,
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
  pink: {
    color: 'pink',
  },
  lightGray: {
    backgroundColor: 'lightgray',
  },
})
