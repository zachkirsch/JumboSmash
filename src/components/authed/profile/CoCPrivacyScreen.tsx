import React, { PureComponent } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Button,
} from 'react-native'
import { JSText } from '../../generic'
import { NavigationScreenProps } from 'react-navigation'

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
    description: "No identity theft. Don't pretend to be someone you're not.",
  },
  {
    emojiTitle: '✅🙋',
    description: 'If you see someone breaking the rules, you can report them from the Profile tab.',
  },
  {
    emojiTitle: '🔐💌',
    description: 'Jumbosmash will delete all your data after graduation - we value your privacy!',
  },
]


type Props = NavigationScreenProps<{}>

class CoCPrivacyScreen extends PureComponent<Props, {}> {

  public render() {
    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.rulesContainer}>
            <JSText fontSize={30} style={styles.title}>Code of Conduct</JSText>
            <JSText style={styles.description}>
              In order to be a JumboSmash user, we ask that you agree to follow
              a few simple rules
            </JSText>
            {this.renderRules()}
          </View>
          <Button
            onPress={() => this.props.navigation.goBack()}
            title={"Go Back"}
          />
        </ScrollView>
    )
  }

  private renderRules = () => {
    return COC_RULES.map((rule, index) => (
      <View style={styles.rule} key={index}>
        <JSText fontSize={20}>{rule.emojiTitle}</JSText>
        <JSText>{rule.description}</JSText>
      </View>
    ))
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  statusBar: {
    height: Platform.OS === 'ios' ? 20 : 0, // space for iOS status bar
  },
  scrollView: {
    flex: 1,
    justifyContent: 'space-around',
  },

  /* heading */

  title: {
    textAlign: 'center',
  },
  description: {
    color: '#7e7e7e',
    marginTop: 10,
    textAlign: 'center',
  },

  /* rules */

  rulesContainer: {
    padding: 20,
  },
  rule: {
    marginTop: 20,
  },

  /* buttons */

  buttonContainer: {
    marginTop: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
})

export default CoCPrivacyScreen
