import React, { PureComponent } from 'react'
import { connect, Dispatch } from 'react-redux'
import { acceptCoC } from '../services/coc'
import { RootState } from '../redux'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native'

interface CoCRule {
  emojiTitle: string
  description: string
}

const COC_RULES: CoCRule[] = [
  {
    emojiTitle: '🚫🍆',
    description: 'No nude pictures, sent, uploaded or otherwise.',
  },
  {
    emojiTitle: '🚫👯',
    description: 'No identity theft: we can boot you from the app if you ' +
    'sell/give your account to someone else, or pretend to be another Tufts ' +
    'student.',
  },
  {
    emojiTitle: '🚫🖕',
    description: 'This app is for smashing, not harassing - hate ' +
    'speech/harassment of any kind will not be tolerated.',
  },
  {
    emojiTitle: '✅🙋🏽',
    description: 'To report an individual, _________. Individuals who get ' +
    'reported may be booted from the app permanently.',
  },
  {
    emojiTitle: '📱❓',
    description: 'Technical concerns or questions? Please reach us at ______.',
  },
]

interface DispatchProps {
  acceptCoC: () => void
}

type Props = DispatchProps

class CodeOfConductScreen extends PureComponent<Props, {}> {

  public render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.rulesContainer}>
            {this.renderTitle()}
            {this.renderDescription()}
            {this.renderRules()}
            {this.renderSignoff()}
          </View>
          <View style={styles.buttonsContainer}>
            {this.renderButtons()}
          </View>
        </View>
      </ScrollView>
    )
  }

  private renderTitle = () => {
    return <Text style={styles.title}>Code of Conduct</Text>
  }

  private renderDescription = () => {
    return (
      <Text style={styles.description}>
        Hello! In order to be a JumboSmash user, we ask that you agree to follow
        a few simple rules:
      </Text>
    )
  }

  private renderRules = () => {
    return COC_RULES.map((rule, index) => (
      <View style={styles.rule} key={index}>
        <Text style={styles.emoji}>{rule.emojiTitle}</Text>
        <Text style={styles.text}>{rule.description}</Text>
      </View>
    ))
  }

  private renderSignoff = () => {
    return (
      <View style={styles.signoff}>
        <Text style={styles.text}>Happy smashing 💕</Text>
        <Text style={styles.text}>The Jumbosmash Team 🐘</Text>
      </View>
    )
  }

  private renderButton = (key: string, text: string, onPress: () => void) => {
    return (
      <TouchableOpacity
        key={key}
        style={styles.buttonContainer}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    )
  }

  private renderButtons = () => {

    const acceptButton = this.renderButton(
      'accept',
      'I agree with the Code of Conduct, let’s smash',
      this.props.acceptCoC
    )

    return [acceptButton]
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },

  /* heading */

  title: {
    fontWeight: 'bold',
    fontSize: 30,
    marginTop: 20,
  },
  description: {
    fontSize: 17,
    color: '#7e7e7e',
    marginTop: 15,
  },

  /* rules */

  rulesContainer: {
    padding: 20,
  },
  rule: {
    marginTop: 20,
  },
  text: {
    fontSize: 19,
    color: '#3f3f3f',
  },
  emoji: {
    fontSize: 25,
  },

  /* bottom */

  signoff: {
    marginTop: 20,
  },

  /* buttons */

  buttonsContainer: {
    marginBottom: 30,
  },
  buttonContainer: {
    margin: 2,
    padding: 5,
    alignItems: 'center',
  },
  buttonText: {
    justifyContent: 'center',
    alignItems: 'center',
    color: '#330f53',
    fontSize: 15,
    fontWeight: 'bold',
  },
})

const mapDispatchToProps = (dispatch: Dispatch<RootState> ): DispatchProps => {
  return {
    acceptCoC: () => dispatch(acceptCoC()),
  }
}

export default connect(undefined, mapDispatchToProps)(CodeOfConductScreen)
