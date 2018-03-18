import React, { PureComponent } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native'
import { connect, Dispatch } from 'react-redux'
import { JSText, RectangleButton } from '../generic'
import { acceptCoC } from '../../services/coc'
import { RootState } from '../../redux'

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

interface OwnProps {
  buttonLabel?: string // defaults to "Accept"
  onPress?: () => void // defaults to acceptCoc
}

interface DispatchProps {
  acceptCoC: () => void
}

type Props = OwnProps & DispatchProps

class CodeOfConductScreen extends PureComponent<Props, {}> {

  public render() {
    return (
      <View>
        <View style={styles.statusBar} />
        <ScrollView>
          <View style={styles.container}>
            {this.renderTitle()}
            {this.renderDescription()}
            {this.renderRules()}
          </View>
          <View style={styles.container}>
            {this.renderSignoff()}
          </View>
          <View style={styles.buttonContainer}>
            {this.renderButton()}
          </View>
        </ScrollView>
      </View>
    )
  }

  private renderTitle = () => {
    return <JSText fontSize={30} bold style={styles.title}>Code of Conduct</JSText>
  }

  private renderDescription = () => {
    return (
      <JSText style={styles.description}>
        In order to be a JumboSmash user, we ask that you agree to follow
        a few simple rules
      </JSText>
    )
  }

  private renderRules = () => {
    return COC_RULES.map((rule, index) => (
      <View style={styles.rule} key={index}>
        {Platform.OS === 'ios' ? <JSText fontSize={20}>{rule.emojiTitle}</JSText> : undefined}
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
      <View>
        <JSText>Happy smashing 💕</JSText>
        <JSText>{signoff}</JSText>
      </View>
    )
  }

  private renderButton = () => {
    return (
      <RectangleButton
        onPress={this.props.onPress || this.props.acceptCoC}
        label={this.props.buttonLabel || "I agree. Let's smash!"}
      />
    )
  }

}

const styles = StyleSheet.create({
  statusBar: {
    height: Platform.OS === 'ios' ? 20 : 0, // space for iOS status bar
  },
  title: {
    textAlign: 'center',
  },
  description: {
    color: '#7e7e7e',
    marginTop: 10,
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
    marginBottom: 50,
  },
})

const mapDispatchToProps = (dispatch: Dispatch<RootState> ): DispatchProps => {
  return {
    acceptCoC: () => dispatch(acceptCoC()),
  }
}

export default connect(undefined, mapDispatchToProps)(CodeOfConductScreen)
