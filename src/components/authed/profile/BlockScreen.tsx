import React, { PureComponent } from 'react'
import { Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { NavigationScreenPropsWithOwnProps } from 'react-navigation'
import { HeaderBar, JSText, JSTextInput } from '../../common'

type Props = NavigationScreenPropsWithOwnProps<{}>

interface BlockedUserMap {
  [email: string]: 'blocked' | 'just_blocked' | 'just_unblocked'
}

interface State {
  blockedUsers: BlockedUserMap,
  textInput: string,
}

const INSTRUCTIONS_START = "You won't see the users you block anywhere on the app, and they won't see you."
  + ' To block a user, enter their Tufts email address below.'
  + ' You can use the '

class BlockScreen extends PureComponent<Props, State> {

  constructor(props: Props) {
     super(props)
     this.state = {
       blockedUsers: {
         'b1ad.dude@tufts.edu': 'blocked',
         'bad1.dude@tufts.edu': 'blocked',
         'bad.d1ude@tufts.edu': 'blocked',
         'bad.dud1e@tufts.edu': 'blocked',
         'bad.dud2e@tufts.edu': 'blocked',
         'bad.dude3@tufts.edu': 'blocked',
         'bad.dude@4tufts.edu': 'blocked',
         'bad.dude@t6ufts.edu': 'blocked',
         'bad.dude@t7ufts.edu': 'blocked',
         'bad.dude@5tufts.edu': 'blocked',
         'bad.dude@3tufts.edu': 'blocked',
         'bad.dude@33tufts.edu': 'blocked',
         'bad.dude@2tufts.edu': 'blocked',
         'bad.dude@tufts3.edu': 'blocked',
         'bad.dude@tu3f1ts.edu': 'blocked',
         'bad.dude@tufts.e1du': 'blocked',
       },
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
        <ScrollView contentContainerStyle={styles.container}>
          <View>
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
            <JSText fontSize={15} bold>Currently Blocked:</JSText>
          </View>
          {this.renderBlockedUsers()}
        </ScrollView>
        {this.renderGradient()}
      </View>
    )
  }

  private renderBlockedUsers = () => {
    return Object.keys(this.state.blockedUsers).sort().map((email) => {

      if (!this.state.blockedUsers.hasOwnProperty(email)) {
        return null
      }

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
          <TouchableOpacity onPress={this.toggleUser(email)} style={styles.iconContainer}>
            {icon}
          </TouchableOpacity>
          <JSText style={textStyles}>{email}</JSText>
        </View>
      )
    })
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
          // TODO: block user
        } else if (status === 'just_unblocked') {
          // TODO: unblock user
        }
      }
    })
  }
}

export default BlockScreen

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  container: {
    padding: 20,
  },
  underline: {
    textDecorationLine: 'underline',
    color: '#171767',
  },
  input: {
    marginVertical: 30,
  },
  blockedUser: {
    flexDirection: 'row',
    alignItems: 'center',
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
})
