import { Map } from 'immutable'
import React, { PureComponent } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect } from 'react-redux'
import { RootState } from '../../../redux'
import { Conversation } from '../../../services/matches'
import MatchesListItem from './MatchesListItem'
import { JSTextInput } from '../../common'

interface State {
  searchBarText: string,
}

interface OwnProps { }

interface StateProps {
  chats: Map<string, Conversation>,
}

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps>

class MatchesList extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      searchBarText: '',
    }
  }

  public render() {
    return (
      <View style={styles.container}>
        <JSTextInput
          onChangeText={this.onChangeSearchBarText}
          style={styles.searchBar}
          placeholder={'🔍Search'}
        />
        <FlatList
          contentContainerStyle={styles.list}
          data={this.getMatches()}
          renderItem={this.renderItem}
          keyExtractor={this.extractConversationId}
        />
      </View>
    )
  }

  private onChangeSearchBarText = (searchBarText: string) => {
    this.setState({ searchBarText })
  }

  private getMatches = () => {
    return this.props.chats.toArray().filter(chat => {
      return chat.otherUsers.find(user => !!user && user.preferredName.includes(this.state.searchBarText))
    })
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
        name={item.otherUsers.first().preferredName}
        onPress={this.openChatScreen(item.conversationId)}
        lastMessage={item.mostRecentMessage}
        messageRead={!item.messagesUnread}
        avatar={item.otherUsers.first().images[0]}
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
  },
})
