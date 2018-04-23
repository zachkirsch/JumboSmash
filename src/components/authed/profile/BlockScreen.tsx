import React, { PureComponent } from 'react'
import { Linking, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Dispatch, connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { HeaderBar, JSText, JSTextInput } from '../../common'
import { blockUser, unblockUser } from '../../../services/profile'
import { RootState } from './../../../redux'

interface StateProps {
  blockedUsers: string[]
}

interface DispatchProps {
  blockUser: (email: string) => void
  unblockUser: (email: string) => void
}

type Props = NavigationScreenPropsWithRedux<{}, StateProps & DispatchProps>

interface BlockedUserMap {
  [email: string]: 'blocked' | 'just_blocked' | 'just_unblocked'
}

interface State {
  blockedUsers: BlockedUserMap
  textInput: string
}

const INSTRUCTIONS_START = "You won't see the users you block anywhere on the app, and they won't see you."
  + ' To block a user, enter their Tufts email address below.'
  + ' You can use the '

class BlockScreen extends PureComponent<Props, State> {

  constructor(props: Props) {
     super(props)

     const blockedUsers: BlockedUserMap = {}
     this.props.blockedUsers.forEach(email => blockedUsers[email] = 'blocked')

     this.state = {
       blockedUsers,
       textInput: '',
     }
   }

  componentDidMount() {
    this.props.navigation.addListener('willBlur', this.saveChanges)
  }

  render() {

    return (
      <View style={styles.fill}>
        <HeaderBar title='Block Users' goBack={this.props.navigation.goBack} />
        <View style={styles.container}>
          <View style={styles.upperContainer}>
            <JSText fontSize={14} style={{textAlign: 'justify'}}>
              {INSTRUCTIONS_START}
              <JSText
                fontSize={14}
                style={styles.underline}
                onPress={this.openWhitePages}
              >
                {'Tufts Whitepages'}
              </JSText>
              {' to look up a student.'}
            </JSText>
            <JSTextInput
              fancy
              autoCapitalize={'none'}
              placeholder='firstname.lastname@tufts.edu'
              returnKeyType={'go'}
              keyboardType={'email-address'}
              autoCorrect={false}
              value={this.state.textInput}
              style={styles.input}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.blockUser(this.state.textInput)}
            />
            <JSText
              fontSize={15}
              bold
              style={styles.currentlyBlocked}
            >
              Currently Blocked
            </JSText>
          </View>
          {this.renderBlockedUsers()}
        </View>
        {this.renderGradient()}
      </View>
    )
  }

  private renderBlockedUsers = () => {
    return (
      <FlatList
        data={Object.keys(this.state.blockedUsers).sort().map(email => ({key: email, email}))}
        renderItem={this.renderBlockedUser}
        style={styles.blockedUsersList}
        contentContainerStyle={styles.blockedUsersContainer}
      />
    )
  }

  private renderBlockedUser = ({item}: {item: {email: string}}) => {

    const email = item.email

    let icon
    const textStyles = []

    switch (this.state.blockedUsers[email]) {
      case 'just_blocked':
      case 'blocked':
        icon = <Entypo name='cross' size={25} color={'red'} style={styles.crossIcon} />
        break
      case 'just_unblocked':
        icon = <FontAwesome name='undo' size={15} color={'blue'} />
        textStyles.push(styles.strikethrough)
        break
    }

    return (
      <View style={styles.blockedUser} key={email}>
        <JSText style={textStyles}>{email}</JSText>
        <TouchableOpacity style={styles.iconContainer} onPress={this.toggleUser(email)}>
          {icon}
        </TouchableOpacity>
      </View>
    )
  }

  private renderGradient = () => {
    return (
      <View style={styles.overlay}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={styles.fill}
        >
            <View style={styles.fill} />
        </LinearGradient>
      </View>
    )
  }

  private openWhitePages = () => Linking.openURL('https://whitepages.tufts.edu/')

  private onChangeText = (value: string) => {this.setState({textInput: value})}

  private blockUser = (email: string) => () => {
    const additionalBlockedUsers: BlockedUserMap = {}
    additionalBlockedUsers[email] = 'just_blocked'

    this.setState({
      blockedUsers: {
        ...this.state.blockedUsers,
        ...additionalBlockedUsers,
      },
      textInput: '',
    })
  }

  private toggleUser = (email: string) => () => {
    const blockedUsers = {...this.state.blockedUsers}
    switch (this.state.blockedUsers[email]) {
      case 'blocked':
        blockedUsers[email] = 'just_unblocked'
        break
      case 'just_blocked':
        delete blockedUsers[email]
        break
      case 'just_unblocked':
        blockedUsers[email] = 'blocked'
    }
    this.setState({blockedUsers})
  }

  private saveChanges = () => {
    Object.keys(this.state.blockedUsers).forEach((email) => {
      if (this.state.blockedUsers.hasOwnProperty(email)) {
        const status = this.state.blockedUsers[email]
        if (status === 'just_blocked') {
          this.props.blockUser(email)
        } else if (status === 'just_unblocked') {
          this.props.unblockUser(email)
        }
      }
    })
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    blockedUsers: state.profile.blockedUsers
      .filter(u => !!u && u.value.blocked)
      .map(u => u && u.value.email)
      .toJS(),
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    blockUser: (email: string) => dispatch(blockUser(email)),
    unblockUser: (email: string) => dispatch(unblockUser(email)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BlockScreen)

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  upperContainer: {
    padding: 20,
    paddingBottom: 0,
  },
  underline: {
    textDecorationLine: 'underline',
    color: '#171767',
  },
  input: {
    marginVertical: 30,
  },
  blockedUsersList: {
    flex: 1,
  },
  blockedUsersContainer: {
    padding: 10,
  },
  blockedUser: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(230, 230, 230, 0.5)',
    marginVertical: 5,
    paddingLeft: 20,
    paddingRight: 10,
    paddingVertical: 10,
    borderRadius: 2,
    overflow: 'hidden',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  crossIcon: {
    paddingTop: 2,
  },
  iconContainer: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentlyBlocked: {
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: 20,
    bottom: 0,
    left: 0,
  },
})
