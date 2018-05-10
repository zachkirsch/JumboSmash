import React, { PureComponent } from 'react'
import {
  Linking,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native'
import { Dispatch, connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { HeaderBar, JSText, JSButton, JSTextInput } from '../../common'
import { goToNextRoute } from '../../navigation'
import { blockUser, unblockUser } from '../../../services/profile'
import { RootState } from './../../../redux'
import { EMAIL_REGEX, getMainColor } from '../../../utils'

interface StateProps {
  myEmail: string
  blockedUsers: string[]
}

interface DispatchProps {
  blockUser: (email: string) => void
  unblockUser: (email: string) => void
}

type Props = NavigationScreenPropsWithRedux<{}, StateProps & DispatchProps> & {
  setupMode?: boolean
}

interface BlockedUser {
  email: string
  status: 'blocked' | 'just_blocked' | 'just_unblocked'
}

interface State {
  blockedUsers: BlockedUser[]
  textInput: string
}

const INSTRUCTIONS_START = "If there's someone you don't want to see, you can block "
  + "them below. They won't see you either. You can use the "

class BlockScreen extends PureComponent<Props, State> {

  constructor(props: Props) {
     super(props)
     this.state = {
       blockedUsers: this.props.blockedUsers.map(email => ({
         email,
         status: 'blocked',
       })) as BlockedUser[],
       textInput: '',
     }
   }

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.fill}
      >
        <View style={styles.fill}>
          {this.renderHeaderBar()}
          <View style={styles.fill}>
            <View style={styles.upperContainer}>
              <JSText style={styles.instructions}>
                {INSTRUCTIONS_START}
                <JSText
                  style={styles.link}
                  onPress={this.openWhitePages}
                >
                  {'Tufts Whitepages'}
                </JSText>
                {' to look up a student.'}
              </JSText>
              <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginVertical: 30}}>
                <JSTextInput
                  fancy
                  autoCapitalize={'none'}
                  placeholder='firstname.lastname@tufts.edu'
                  returnKeyType={'next'}
                  enablesReturnKeyAutomatically
                  keyboardType={'email-address'}
                  autoCorrect={false}
                  value={this.state.textInput}
                  style={styles.input}
                  onChangeText={this.onChangeText}
                  onSubmitEditing={this.onSubmitText}
                  blurOnSubmit={false}
                />
                <TouchableOpacity
                  style={styles.addIconContainer}
                  onPress={this.onSubmitText}
                  disabled={!this.state.textInput}
                >
                  <Ionicons
                    name='md-add-circle'
                    size={25}
                    color={this.state.textInput ? getMainColor() : 'lightgray'}
                    style={[styles.icon, styles.addIcon]}
                  />
                </TouchableOpacity>
              </View>
              <JSText bold style={styles.currentlyBlocked}>
                Currently Blocked:
              </JSText>
            </View>
            {this.renderBlockedUsers()}
          </View>
          {this.renderGradient()}
        </View>
        {this.props.setupMode && this.renderContinue()}
      </KeyboardAvoidingView>
    )
  }

  private renderHeaderBar = () => {
    if (this.props.setupMode) {
      return (
        <View style={styles.header}>
          <JSText bold style={styles.headerText}>BLOCK USERS</JSText>
        </View>
      )
    }
    return (
      <HeaderBar
        title='Block Users'
        onPressLeft={this.props.navigation.goBack}
        renderLeft={this.renderHeaderLeft}
        onPressRight={this.saveAndGoBack}
        renderRight={this.renderHeaderRight}
      />
    )
  }

  private renderHeaderLeft = () => {
    return (
      <JSText style={styles.headerBarSideText}>Cancel</JSText>
    )
  }

  private renderHeaderRight = () => {
    return (
      <JSText style={styles.headerBarSideText}>Save</JSText>
    )
  }

  private renderBlockedUsers = () => {

    if (this.state.blockedUsers.length === 0) {
      return (
        <View style={styles.noBlockedUsersContainer}>
          <JSText style={styles.noBlockedUsers}>No Blocked Users</JSText>
        </View>
      )
    }

    return (
      <FlatList
        data={this.state.blockedUsers}
        keyExtractor={this.extractEmailFromUser}
        renderItem={this.renderBlockedUser}
        style={styles.blockedUsersList}
        contentContainerStyle={styles.blockedUsersContainer}
        ItemSeparatorComponent={this.renderSeparator}
        keyboardShouldPersistTaps='handled'
      />
    )
  }

  private extractEmailFromUser = (user: BlockedUser) => user.email

  private renderBlockedUser = ({item, index}: {item: BlockedUser, index: number}) => {

    const email = item.email

    let icon
    const textStyles = []

    switch (item.status) {
      case 'just_blocked':
      case 'blocked':
        icon = <Entypo name='cross' size={25} color={'red'} style={[styles.icon, styles.crossIcon]} />
        break
      case 'just_unblocked':
        icon = <FontAwesome name='undo' size={15} color={getMainColor()} style={styles.icon} />
        textStyles.push(styles.strikethrough)
        break
    }

    return (
      <View style={styles.blockedUser} key={email}>
        <JSText style={textStyles}>{email}</JSText>
        <TouchableOpacity style={styles.iconContainer} onPress={this.toggleUser(index)}>
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
    this.saveChanges(() => goToNextRoute(this.props.navigation))
  }

  private openWhitePages = () => Linking.openURL('https://whitepages.tufts.edu/')

  private onChangeText = (value: string) => this.setState({textInput: value})

  private onSubmitText = () => this.blockUser()

  private blockUser = (onComplete?: (success: boolean) => void) => {
    const email = this.state.textInput
    if (!email) {
      return
    }

    let errorMessage
    if (email === this.props.myEmail) {
      errorMessage = "You can't block yourself"
    } else if (!EMAIL_REGEX.test(email) || !email.endsWith('@tufts.edu')) {
      errorMessage = "That's not a Tufts e-mail address"
    }

    if (errorMessage) {
      Alert.alert('Oops', errorMessage)
      onComplete && onComplete(false)
    } else {
      this.setState({
        blockedUsers: [{
          email,
          status: 'just_blocked',
        }, ...this.state.blockedUsers],
        textInput: '',
      }, onComplete && (() => onComplete(true)))
    }
  }

  private toggleUser = (index: number) => () => {
    const blockedUsers = [...this.state.blockedUsers]
    switch (this.state.blockedUsers[index].status) {
      case 'blocked':
        blockedUsers[index] = {
          ...blockedUsers[index],
          status: 'just_unblocked',
        }
        break
      case 'just_blocked':
        blockedUsers.splice(index, 1)
        break
      case 'just_unblocked':
        blockedUsers[index] = {
          ...blockedUsers[index],
          status: 'blocked',
        }
    }
    this.setState({blockedUsers})
  }

  private saveChanges = (onSave?: () => void) => {

    const save = () => {
      this.state.blockedUsers.forEach(user => {
        if (user.status === 'just_blocked') {
          this.props.blockUser(user.email)
        } else if (user.status === 'just_unblocked') {
          this.props.unblockUser(user.email)
        }
      })
      onSave && onSave()
    }

    if (this.state.textInput) {
      Alert.alert(
        '',
        `Do you want to block ${this.state.textInput}?`,
        [
          {
            text: 'No',
            style: 'cancel',
            onPress: save,
          },
          {
            text: 'Yes',
            onPress: () => this.blockUser(success => success && save()),
          },
        ]
      )
    } else {
      save()
    }
  }

  private saveAndGoBack = () => {
    this.saveChanges(this.props.navigation.goBack)
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    blockedUsers: state.profile.blockedUsers
      .filter(u => !!u && u.value.blocked)
      .map(u => u && u.value.email)
      .toJS(),
    myEmail: state.auth.email,
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
    paddingTop: 10,
  },
  link: {
    fontSize: 14,
    textDecorationLine: 'underline',
    color: getMainColor(),
  },
  input: {
    marginVertical: 0,
    flex: 1,
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
    marginHorizontal: 10,
    textAlign: 'center',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'lightgray',
  },
  header: {
    marginTop: Platform.select({
      ios: 35,
      android: 20,
    }),
  },
  currentlyBlocked: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 5,
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
  icon: {
    backgroundColor: 'transparent',
  },
  addIcon: {
  },
  addIconContainer: {
    height: 45,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBarSideText: {
    color: getMainColor(),
    fontSize: 15,
  },
})
