import { Map } from 'immutable'
import React, { PureComponent } from 'react'
import { FlatList, Keyboard, StyleSheet, View } from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../../redux'
import { Conversation } from '../../../services/matches'
import { rehydrateProfileFromServer } from '../../../services/profile'
import MatchesListItem from './MatchesListItem'
import { JSTextInput } from '../../common'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { User } from '../../../services/swipe'

interface State {
  searchBarText: string
  refreshingList: boolean
}

interface OwnProps { }

interface StateProps {
  chats: Map<string, Conversation>
  allUsers: Map<number, User>
  rehydratingProfileFromServer: boolean
}

interface DispatchProps {
  rehydrateProfileFromServer: () => void
}

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>

class MatchesList extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      searchBarText: '',
      refreshingList: false,
    }
  }

  componentDidMount() {
    this.props.navigation.addListener('didBlur', Keyboard.dismiss)
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      refreshingList: nextProps.rehydratingProfileFromServer,
    })
  }

  public render() {
    return (
      <View style={styles.container}>
        {this.renderSearchBar()}
        <FlatList
          data={this.getMatches()}
          renderItem={this.renderItem}
          keyExtractor={this.extractConversationId}
          refreshing={this.state.refreshingList}
          onRefresh={this.rehydrateProfileFromServer}
        />
      </View>
    )
  }

  private renderSearchBar = () => {
    return (
      <View style={styles.searchBarContainer}>
        <Ionicons
          name='ios-search'
          style={{position: 'absolute', left: 10}}
          color='gray'
          size={20}
        />
        <JSTextInput
          onChangeText={this.onChangeSearchBarText}
          style={styles.searchBar}
          placeholder={'Search'}
          underline={false}
          autoCorrect={false}
        />
      </View>
    )
  }

  private rehydrateProfileFromServer = () => {
    this.setState({
      refreshingList: true,
    }, this.props.rehydrateProfileFromServer)
  }

  private onChangeSearchBarText = (searchBarText: string) => {
    this.setState({ searchBarText })
  }

  private getMatches = () => {

    let chats = this.props.chats.toArray()
    if (this.state.searchBarText) {
      chats = this.props.chats.toArray().filter(chat => {
        return chat.otherUsers.find(userId => {
          const otherUser = this.props.allUsers.get(userId)
          if (!otherUser) {
            return false
          }
          return otherUser.fullName.toLowerCase().includes(this.state.searchBarText.toLowerCase().trim())
        })
      })
    }

    const sortedChats = chats.sort((a, b) => {
      const aTime = a.messages.size > 0 ? a.messages.first().createdAt : a.createdAt
      const bTime = b.messages.size > 0 ? b.messages.first().createdAt : b.createdAt
      return bTime - aTime
    })
    return sortedChats
  }

  private extractConversationId = (item: Conversation) => item.conversationId

  private openChatScreen = (conversationId: string) => () => {
    this.props.navigation.navigate('Chat', {
      conversationId,
    })
  }

  private renderItem = ({item}: {item: Conversation}) => {
    const otherUser = this.props.allUsers.get(item.otherUsers[0])
    return (
      <MatchesListItem
        name={otherUser && otherUser.preferredName}
        onPress={this.openChatScreen(item.conversationId)}
        lastMessage={item.mostRecentMessage}
        messagesUnread={item.messagesUnread}
        avatar={otherUser && otherUser.images[0]}
        newMatch={item.messages.size === 0}
      />
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    chats: state.matches.chats,
    allUsers: state.swipe.allUsers.value,
    rehydratingProfileFromServer: state.profile.rehydratingProfileFromServer,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    rehydrateProfileFromServer: () => dispatch(rehydrateProfileFromServer()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchesList)

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingVertical: 5,
    paddingHorizontal: 25,
    fontSize: 20,
  },
})
