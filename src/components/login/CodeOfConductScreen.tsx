import React, { PureComponent } from 'react'
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { JSText, RectangleButton } from '../common'
import { openTermsOfService } from '../../utils'

interface CoCRule {
  emojiTitle: string
  description: string
}

const COC_RULES: CoCRule[] = [
  {
    emojiTitle: '🚫🍆',
    description: 'No nudes.',
  },
  {
    emojiTitle: '🚫🖕',
    description: 'No harrassment.',
  },
  {
    emojiTitle: '🚫👯',
    description: "Don't pretend to be someone you're not.",
  },
  {
    emojiTitle: '✅🙋',
    description: 'If you see someone breaking the rules, please report them from the Profile tab.',
  },
]

interface Props {
  reviewing?: boolean // defaults to false
  buttonLabel?: string // defaults to "Accept"
  onPress?: () => void
}

/*tslint:disable-next-line:max-line-length */
const TERMS_OF_SERVICE = 'To access this app, you must agree to our terms of service, which more formally states the above rules. Violating these terms will lead to an instant termination of your account.'

class CodeOfConductScreen extends PureComponent<Props, {}> {

  public render() {
    return (
      <View style={styles.flex}>
        {this.props.reviewing || <View style={styles.statusBar} />}
        <ScrollView contentContainerStyle={styles.container}>
          {this.props.reviewing || this.renderTitle()}
          {this.renderDescription()}
          {this.renderRules()}
          {this.renderTermsOfService()}
          {this.renderSignoff()}
          <View style={styles.buttonContainer}>
            {this.renderTOSLink()}
            { this.props.reviewing || this.renderAgreeButton() }
          </View>
        </ScrollView>
      </View>
    )
  }

  private renderTitle = () => {
    return <JSText bold style={styles.title}>Code of Conduct</JSText>
  }

  private renderDescription = () => {
    return (
      <JSText style={styles.description}>
        In order to be a JumboSmash user, we ask that you follow a few rules
      </JSText>
    )
  }

  private renderRules = () => {
    return COC_RULES.map((rule, index) => (
      <View style={styles.rule} key={index}>
        {Platform.OS === 'ios' && <JSText style={styles.emoji}>{rule.emojiTitle}</JSText>}
        <JSText>{rule.description}</JSText>
      </View>
    ))
  }

  private renderSignoff = () => {

    let signoff = 'The JumboSmash Team'
    if (Platform.OS === 'ios') {
      signoff += ' 🐘'
    }

    return (
      <View style={styles.signoff}>
        <JSText>Happy smashing 💕</JSText>
        <JSText>{signoff}</JSText>
      </View>
    )
  }

  private renderTermsOfService = () => {
    if (Platform.OS !== 'ios') {
      return null
    }
    return (
      <View style={styles.termsOfService}>
        <JSText bold>{TERMS_OF_SERVICE}</JSText>
      </View>
    )
  }

  private renderTOSLink = () => {
    return (
      <RectangleButton
        onPress={openTermsOfService}
        label='Read Terms of Service'
      />
    )
  }

  private renderAgreeButton = () => {
    return (
      <RectangleButton
        active
        onPress={this.props.onPress}
        label={this.props.buttonLabel || "I agree. Let's smash!"}
      />
    )
  }

}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  statusBar: {
    height: Platform.OS === 'ios' ? 20 : 0, // space for iOS status bar
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    marginBottom: 10,
  },
  description: {
    color: '#7e7e7e',
    textAlign: 'center',
  },
  container: {
    padding: 20,
  },
  rule: {
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
  emoji: {
    fontSize: 20,
  },
  termsOfService: {
    marginTop: 30,
  },
  signoff: {
    marginTop: 30,
  },
})

export default CodeOfConductScreen
