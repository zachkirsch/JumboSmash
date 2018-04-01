import React, { PureComponent } from 'react'
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../redux'
import { acceptCoC } from '../../services/coc'
import { JSText, RectangleButton } from '../common'

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
    description: "Don't pretend to be someone you're not, please use your real preferred name.",
  },
  {
    emojiTitle: '✅🙋',
    description: 'If you see someone breaking the rules, you can report them from the Profile tab.',
  },
  {
    emojiTitle: '🔐💌',
    description: 'We value your privacy! Jumbosmash will delete all your data after graduation.',
  },
]

interface OwnProps {
  inNavigator?: boolean // defaults to false
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
      <View style={styles.flex}>
        {this.props.inNavigator || <View style={styles.statusBar} />}
        <ScrollView>
          <View style={styles.container}>
            {this.props.inNavigator || this.renderTitle()}
            {this.renderDescription()}
            {this.renderRules()}
          </View>
          <View style={styles.container}>
            {this.renderSignoff()}
          </View>
          {this.props.inNavigator || this.renderButton()}
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
        In order to be a JumboSmash user, we ask that you follow a few rules
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
      <View style={styles.buttonContainer}>
        <RectangleButton
          onPress={this.props.onPress || this.props.acceptCoC}
          label={this.props.buttonLabel || "I agree. Let's smash!"}
        />
      </View>
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
    marginBottom: 50,
  },
})

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    acceptCoC: () => dispatch(acceptCoC()),
  }
}

export default connect(undefined, mapDispatchToProps)(CodeOfConductScreen)
