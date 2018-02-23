import React, { PureComponent } from 'react'
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native'

interface Props {
  name: string,
  onPress: () => void,
  lastMessage: string,
  messageRead: boolean,
  profilePic: string,
}

interface State {

}

class MatchesListItem extends PureComponent<Props, State> {

  public render() {
    // let display = this.props.messageRead ? 'Unread' : 'Read';
    return (
    <View>
        <TouchableOpacity style={styles.match} onPress={this.props.onPress}>
          <Image source={{uri: this.props.profilePic}} style={styles.avatarPhoto} />
          <Text style={this.props.messageRead ? styles.readText : styles.unreadText}>{this.props.name}: {this.props.lastMessage}</Text>
        </TouchableOpacity>
      </View>
    )
  }

}

export default MatchesListItem

const styles = StyleSheet.create({
  match: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 15,
  },
  readText: {
    fontWeight: 'normal',
    textAlignVertical: 'center',
    marginLeft: 15,
    flexDirection: 'column',
    flex: 0.9
  },
  unreadText: {
    fontWeight: 'bold',
    textAlignVertical: 'center',
    marginLeft: 15,
    flexDirection: 'column',
    flex: 0.9
  },
  avatarPhoto: {
    width: 100,
    height: 100,
  }
});
