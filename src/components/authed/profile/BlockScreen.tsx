import React, { PureComponent } from 'react'
import { View, StyleSheet, ScrollView, Linking, TouchableOpacity, Platform } from 'react-native'
import { default as Entypo } from 'react-native-vector-icons/Entypo'
import { default as FontAwesome } from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient'
import { NavigationScreenPropsWithOwnProps } from 'react-navigation'
import { JSText, RectangleButton, JSTextInput } from '../../generic/index'

type Props = NavigationScreenPropsWithOwnProps<{}>

interface State {
  blockedUsers: {
    [email: string]: 'blocked' | 'just_blocked' | 'just_unblocked'
  },
  textInput: string,
}

class BlockScreen extends PureComponent<Props, State> {

  constructor(props: Props) {
     super(props)
     this.state = {
       blockedUsers: {
         'bad.dude@tufts.edu': 'blocked',
       },
       textInput: '',
     }
   }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container} scrollEnabled={false}>
        <View style={styles.textContainer}>
          <JSText fontSize={40} bold style={styles.mainTitle}>Block Users</JSText>
          <JSText fontSize={14} style={{textAlign: 'justify'}}>
            {"You won't see the users you block anywhere on the app, and they won't see you."
             + ' To block a user, enter their Tufts email address below.'
             + ' You can use the '}
            <JSText
              fontSize={14}
              style={styles.underline}
              onPress={() => Linking.openURL('https://whitepages.tufts.edu/')}
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
            onChangeText = {(value) => {this.setState({textInput: value})}}
            onSubmitEditing ={() => this.blockUser(this.state.textInput)}
          />
          <JSText fontSize={15} bold>Currently Blocked:</JSText>
          <View style={styles.fill}>
            <ScrollView bounces={false} contentContainerStyle={styles.blockedUsers}>
              {this.renderBlockedUsers()}
            </ScrollView>
            {this.renderGradient()}
          </View>
        </View>
        <View style={styles.buttons}>
          <RectangleButton
            onPress={() => this.props.navigation.goBack()}
            label='Save Changes'
          />
          <RectangleButton
            onPress={() => this.props.navigation.goBack()}
            label='Discard Changes'
          />
        </View>
      </ScrollView>
    )
  }

  private renderBlockedUsers = () => {
    return Object.keys(this.state.blockedUsers).map(email => {

      let icon
      const textStyles = []

      switch (this.state.blockedUsers[email]) {
        case 'just_blocked':
        case 'blocked':
          icon = <Entypo name='cross' size={25} color={'red'} style={styles.crossIcon} />
          break
        case 'just_unblocked':
          icon = <FontAwesome name='undo' size={15} color={'red'} />
          textStyles.push(styles.strikethrough)
          break
      }

      return (
        <View style={styles.blockedUser} key={email}>
          <TouchableOpacity onPress={() => this.toggleUser(email)} style={styles.iconContainer}>
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
          start={{x: 0, y: 0}} end={{x: 0, y: 1}}
          style={styles.fill}
        >
            <View style={styles.fill} />
        </LinearGradient>
      </View>
    )
  }

  private blockUser = (email: string) => {
    const blockedUsers = Object.assign({}, this.state.blockedUsers)
    blockedUsers[email] = 'just_blocked'

    this.setState({
      blockedUsers,
      textInput: '',
    })
  }

  private toggleUser = (email: string) => {
    const blockedUsers = Object.assign({}, this.state.blockedUsers)
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
}

export default BlockScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {
    marginTop: 20,
    justifyContent: 'space-around',
    marginHorizontal: 30,
    flex: 3,
  },
  buttons: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
    paddingVertical: 1,
  },
  mainTitle: {
    textAlign: 'center',
    marginBottom: 15,
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
    ...Platform.select({
      android: {
        elevation: 9,
      },
    }),
  },
  fill: {
    flex: 1,
  },
  blockedUsers: {
    paddingBottom: 20,
  },
})
