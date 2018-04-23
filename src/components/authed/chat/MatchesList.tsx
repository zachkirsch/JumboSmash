import { Map } from 'immutable'
import React, { PureComponent } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect } from 'react-redux'
import { RootState } from '../../../redux'
import { Conversation } from '../../../services/matches'
import MatchesListItem from './MatchesListItem'
import { JSTextInput } from '../../common'
import Ionicons from 'react-native-vector-icons/Ionicons'

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
        {this.renderSearchBar()}
        <FlatList
          contentContainerStyle={styles.list}
          data={this.getMatches()}
          renderItem={this.renderItem}
          keyExtractor={this.extractConversationId}
        />
      </View>
    )
  }

  private renderSearchBar = () => {
    return (
      <View style={styles.searchBarContainer}>
        <Ionicons
          name='ios-search'
          style={{marginLeft: 10, marginVertical: 3}}
          color='gray'
          size={20}
        />
        <JSTextInput
          onChangeText={this.onChangeSearchBarText}
          style={styles.searchBar}
          placeholder={'Search'}
          underline={false}
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
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
    backgroundColor: 'rgb(250, 250, 250)',
    borderRadius: 40,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'lightgray',
  },
  searchBar: {
    flex: 1,
    textAlign: 'center',
    marginLeft: 3,
    marginRight: 7,
  },
})
