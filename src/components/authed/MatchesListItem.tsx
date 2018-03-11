import React, { PureComponent } from 'react'
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native'
import JSText from '../generic/JSText'
import LinearGradient from 'react-native-linear-gradient'

interface Props {
  name: string,
  onPress: () => void,
  lastMessage: string,
  messageRead: boolean,
  avatar: string,
}

interface State {

}

class MatchesListItem extends PureComponent<Props, State> {

  public render() {
    // let display = this.props.messageRead ? 'Unread' : 'Read';
    return (
    <View>
      {this.props.messageRead ? this.readItem() : this.unreadItem()}
    </View>
    )
  }

  private readItem() {
    return (
      <TouchableOpacity style={styles.match} onPress={this.props.onPress}>
        <Image source={{uri: this.props.avatar}} style={styles.avatarPhoto} />
        <View style={styles.textContainer}>
          <JSText style={styles.nameText}>{this.props.name}</JSText>
          <JSText numberOfLines={1} style={styles.readText}>{this.props.lastMessage}</JSText>
        </View>
      </TouchableOpacity>
    )
  }

  private unreadItem() {
    return (
      <LinearGradient
        colors={['rgba(231,240,253,0.1)', 'rgba(172,203,238,0.2)']}
        start={{x: 0, y: 1}} end={{x: 1, y: 1}}
        locations={[0, 1]}
        style={styles.container}
      >
      <TouchableOpacity style={styles.match} onPress={this.props.onPress}>
        <Image source={{uri: this.props.avatar}} style={styles.avatarPhoto} />
        <View style={styles.textContainer}>
          <JSText style={styles.nameText}>{this.props.name}</JSText>
          <JSText bold={true} numberOfLines={1} style={styles.unreadText}>{this.props.lastMessage}</JSText>
        </View>
      </TouchableOpacity>
      </LinearGradient>
    )
  }

}

export default MatchesListItem

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
  },
  match: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 8,
  },
  nameText: {
    color: 'black',
  },
  readText: {
    color: 'gray',
  },
  unreadText: {
    color: 'rgb(46,64,90)',
  },
  avatarPhoto: {
    marginLeft: 25,
    marginRight: 15,
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  textContainer: {
    flexDirection: 'column',
    flex: .9,
    justifyContent: 'center',
  },
})
