import React, { PureComponent } from 'react'
import {
  FlatList,
  StyleSheet,
  View,
} from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect, Dispatch } from 'react-redux'
import { JSText, JSImage, HeaderBar, JSTextInput } from '../../common'
import { RootState } from '../../../redux'
import { User, fetchAllUsers } from '../../../services/swipe'
import { Event } from '../../../services/profile'
import Ionicons from 'react-native-vector-icons/Ionicons'

interface OwnProps {
  event: Event
}

interface StateProps {
  allUsers: User[]
  fetchingAllUsers: boolean
  myId: number
  myAvatar: string | undefined
}

interface DispatchProps {
  fetchAllUsers: () => void
}

interface State {
  searchBarText: string
  refreshingList: boolean
}

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>

class EventScreen extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      searchBarText: '',
      refreshingList: false,
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      refreshingList: nextProps.fetchingAllUsers,
    })
  }

  render() {
    return (
      <View style={styles.fill}>
        <HeaderBar title={this.props.navigation.state.params.event.name} onPressLeft={this.props.navigation.goBack}/>
        {this.renderSearchBar()}
        <FlatList
          data={this.getUsers()}
          renderItem={this.renderItem}
          keyExtractor={this.extractUserId}
          refreshing={this.state.refreshingList}
          onRefresh={this.fetchAllUsers}
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

  private renderItem = ({item}: {item: User}) => {
    if (!item) {
      return null
    }
    let avatar = item.images[0]
    let name = item.fullName
    if (item.id === this.props.myId) {
      avatar = this.props.myAvatar || ''
      name = item.fullName + ' (You)'
    }
    return (
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', padding: 8}}>
        <JSImage cache={false} source={{uri: avatar}} style={{width: 36, height: 36, marginRight: 15, borderRadius: 18}}/>
        <JSText style={{fontSize: 20, paddingTop: 5}}>{name}</JSText>
      </View>
    )
  }

  private fetchAllUsers = () => {
    this.setState({
      refreshingList: true,
    }, this.props.fetchAllUsers)
  }

  private onChangeSearchBarText = (searchBarText: string) => {
    this.setState({
      searchBarText,
    })
  }

  private getUsers = () => {
    let users = this.props.allUsers.filter(u => {
      if (!u) {
        return false
      }
      if (u.id === this.props.myId) {
        return this.props.navigation.state.params.event.going
      } else {
        return u.events.find(id => id === this.props.navigation.state.params.event.id)
      }
    })
    if (this.state.searchBarText) {
      users = users.filter(user => {
        if (!user) {
          return false
        }
        return user.fullName.toLowerCase().includes(this.state.searchBarText.toLowerCase().trim())
      })
    }
    return users.sort((a, b) => {
      if (a.id === this.props.myId) {
        return -1
      }
      return a.surname.toLowerCase().localeCompare(b.surname.toLowerCase())
    })
  }

  private extractUserId = (user?: User) => user ? user.id.toString(10) : ''
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    allUsers: state.swipe.allUsers.value.valueSeq().toArray(),
    fetchingAllUsers: state.swipe.allUsers.loading,
    myId: state.profile.id,
    myAvatar: state.profile.images.get(0) && state.profile.images.get(0).value.uri,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    fetchAllUsers: () => dispatch(fetchAllUsers()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventScreen)

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  topContainer: {
    padding: 20,
    backgroundColor: 'rgb(219, 230, 253)',
  },
  search: {
    padding: 10,
  },
  tagSection: {
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  topContainerWithRoomForStatusBar: {
     paddingTop: 28,
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
