import { Map } from 'immutable'
import React, { PureComponent } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect } from 'react-redux'
import { RootState } from '../../../redux'
import { Conversation } from '../../../services/matches'
import { getFirstName } from '../../../utils'
import SearchBar from 'react-native-searchbar'
import MatchesListItem from './MatchesListItem'
import JSTextInput from "../../common/JSTextInput";

interface State {
  searchBarText: string,
}

interface OwnProps { }

interface StateProps {
  chats: Map<string, Conversation>,
}

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps>

class MatchesList extends PureComponent<Props, State> {

  constructor(props) {
    super(props)
    this.state = { searchBarText: '', }
  }

  public render() {
    return (
      <View style={styles.container}>
        <JSTextInput onChangeText={(term) => { this.searchUpdated(term) }}
                     style={styles.searchBar}
                     placeholder={'🔍Search'}/>
        <FlatList
          contentContainerStyle={styles.list}
          data={this.props.chats.toArray().filter(chat => chat.otherUsers.get(0).name.includes(this.state.searchBarText))}
          renderItem={this.renderItem}
          keyExtractor={this.extractConversationId}
        />
      </View>
    )
  }

  private searchUpdated(term) {
    this.setState({ searchBarText: term })
  }

  private extractConversationId = (item: Conversation) => item.conversationId

  private openChatScreen = (conversationId: string) => () => {
    this.props.navigation.navigate('Chat', {
      conversationId,
    })
  }

  private renderItem = ({item}: {item: Conversation}) => {
    return (
      <MatchesListItem
        name={getFirstName(item.otherUsers.first().name)}
        onPress={this.openChatScreen(item.conversationId)}
        lastMessage={item.mostRecentMessage}
        messageRead={!item.messagesUnread}
        avatar={item.otherUsers.first().avatar}
        newMatch={true}
      />
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    chats: state.matches.chats,
  }
}

export default connect(mapStateToProps)(MatchesList)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    marginTop: 10,
  },
  center: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderColor: 'gray',
    borderBottomWidth: 1,
  },
  openChatContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 5,
    marginTop: 15,
  },
  searchBar: {
    textAlign: 'center',
    textAlignVertical: 'center',
    marginHorizontal: 5,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginTop: 10,
  }
})
