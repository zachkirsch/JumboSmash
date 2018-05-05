import React, { PureComponent } from 'react'
import {
  Linking,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  ScrollView,
} from 'react-native'
import { Dispatch, connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { HeaderBar, JSText, JSButton, JSTextInput } from '../../common'
import { goToNextRoute } from '../../navigation'
import { blockUser, unblockUser } from '../../../services/profile'
import { RootState } from './../../../redux'
import { EMAIL_REGEX } from '../../../utils'

interface StateProps {
  blockedUsers: string[]
}

interface DispatchProps {
  blockUser: (email: string) => void
  unblockUser: (email: string) => void
}

type Props = NavigationScreenPropsWithRedux<{}, StateProps & DispatchProps> & {
  setupMode?: boolean
}

interface BlockedUserMap {
  [email: string]: 'blocked' | 'just_blocked' | 'just_unblocked'
}

interface State {
  blockedUsers: BlockedUserMap
  textInput: string
}

const INSTRUCTIONS_START = "You won't see the users you block anywhere on the app, and they won't see you."
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
      <ScrollView contentContainerStyle={styles.fill} scrollEnabled={false}>
        <View style={styles.fill}>
          {this.renderHeaderBar()}
          <View style={styles.fill}>
            <View style={styles.upperContainer}>
              <JSText style={[styles.instructions, { textAlign: 'center' }]}>
                {INSTRUCTIONS_START}
                <JSText
                  style={styles.link}
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
                returnKeyType={'done'}
                keyboardType={'email-address'}
                autoCorrect={false}
                value={this.state.textInput}
                style={styles.input}
                onChangeText={this.onChangeText}
                onSubmitEditing={this.blockUser(this.state.textInput)}
              />
              <JSText bold style={styles.currentlyBlocked}>
                Currently Blocked:
              </JSText>
            </View>
            {this.renderBlockedUsers()}
          </View>
          {this.renderGradient()}
        </View>
        {this.props.setupMode && this.renderContinue()}
      </ScrollView>
    )
  }

  private renderHeaderBar = () => {
    if (this.props.setupMode) {
      return (
        <View style={styles.header}>
          <JSText bold style={styles.headerText}>Block Users</JSText>
        </View>
      )
    }
    return (
      <HeaderBar title='Block Users' onPressLeft={this.props.navigation.goBack} />
    )
  }

  private renderBlockedUsers = () => {

    if (Object.keys(this.state.blockedUsers).length === 0) {
      return (
        <View style={styles.noBlockedUsersContainer}>
          <JSText style={styles.noBlockedUsers}>No Blocked Users</JSText>
        </View>
      )
    }

    const blockedEmails = Object.keys(this.state.blockedUsers).sort().map(email => ({key: email, email}))
    return (
      <FlatList
        data={blockedEmails}
        renderItem={this.renderBlockedUser}
        style={styles.blockedUsersList}
        contentContainerStyle={styles.blockedUsersContainer}
        ItemSeparatorComponent={this.renderSeparator}
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

  private renderSeparator = () => {
    return (
      <View
        style={styles.separator}
      />
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

  private renderContinue = () => {
    return (
      <View style={styles.continue}>
        <JSButton label='Continue' onPress={this.goToNextRoute} />
      </View>
    )
  }

  private goToNextRoute = () => {
    this.saveChanges()
    goToNextRoute(this.props.navigation)
  }

  private openWhitePages = () => Linking.openURL('https://whitepages.tufts.edu/')

  private onChangeText = (value: string) => {this.setState({textInput: value})}

  private blockUser = (email: string) => () => {
    if (!email) {
      return
    }

    if (!EMAIL_REGEX.test(email) || !email.endsWith('@tufts.edu')) {
      Alert.alert(
        'Oops',
        "That's not a Tufts e-mail"
      )
      return
    }

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
  upperContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  link: {
    fontSize: 14,
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
    paddingLeft: 20,
    paddingRight: 10,
    paddingVertical: 5,
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
  overlay: {
    position: 'absolute',
    width: '100%',
    height: 20,
    bottom: 0,
    left: 0,
  },
  instructions: {
    fontSize: 14,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'lightgray',
  },
  header: {
    marginTop: Platform.select({
      ios: 28,
      android: 10,
    }),
  },
  currentlyBlocked: {
    fontSize: 15,
    textAlign: 'center',
  },
  headerText: {
    fontSize: 20,
    textAlign: 'center',
  },
  noBlockedUsersContainer: {
    flex: 1,
    alignItems: 'center',
  },
  noBlockedUsers: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 20,
    color: 'lightgray',
  },
  continue: {
    marginBottom: 20,
    marginHorizontal: 20,
  },
})
