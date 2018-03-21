import React, { PureComponent } from 'react'
import { connect, Dispatch } from 'react-redux'
import { Alert, View, StyleSheet} from 'react-native'
import { RectangleButton } from '../../common/index'
import { logout } from '../../../services/auth'
import { connectActionSheet, ActionSheetProps } from '@expo/react-native-action-sheet'
import { RootState } from '../../../redux'
import { emailSupport, ActionSheetOption, generateActionSheetOptions } from '../../utils'

interface OwnProps {
  previewProfile: () => void
  block: () => void
  viewCoC: () => void
}

interface StateProps {

}

interface DispatchProps {
  logout: () => void
}

type Props = ActionSheetProps<OwnProps & StateProps & DispatchProps>

@connectActionSheet
class SettingsSection extends PureComponent<Props, {}> {
  constructor(props: Props) {
     super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <RectangleButton
          label='Preview Profile'
          onPress={this.props.previewProfile}
          active
        />
        <RectangleButton
          label={'Help & Feedback'}
          onPress={this.openHelpActionSheet}
        />
        <RectangleButton
          label='Stop Smashing'
          onPress={this.openSettingsActionSheet}
        />
      </View>
    )
  }

  private openSettingsActionSheet = () => {

    const buttons: ActionSheetOption[] = []

    // LOGOUT BUTTON
    buttons.push({
      title: 'Log Out',
      onPress: () => {
        Alert.alert(
          'Logout',
          'Are you sure you want to log out?',
          [
            { text: 'Yes', onPress: this.props.logout },
            { text: 'No', style: 'cancel' },
          ]
        )
      },
    })

    // DEACTIVATE ACCOUNT BUTTON
    buttons.push({
      title: 'Deactivate Account',
      destructive: true,
      onPress: () => {
        Alert.alert(
          'Deactivate My Account',
          'This will prevent others from seeing your profile until you log back in again.',
          [
            {text: 'Deactivate', onPress: () => this.props.logout()},
            {text: 'Cancel', style: 'cancel'},
          ]
        )
      },
    })

    const {options, callback} = generateActionSheetOptions(buttons)
    this.props.showActionSheetWithOptions(options, callback)
  }

  private openHelpActionSheet = () => {

    const buttons: ActionSheetOption[] = []

    // REPORT USER
    buttons.push({
      title: 'Report User',
      onPress: () => emailSupport('Report User'),
    })

    // BLOCK USER
    buttons.push({
      title: 'Block Users',
      onPress: this.props.block,
    })

    // CoC
    buttons.push({
      title: 'Code of Conduct',
      onPress: this.props.viewCoC,
    })

    // Feedback
    buttons.push({
      title: 'Submit Feedback',
      onPress: () => emailSupport('JumboSmash Feedback'),
    })

    const {options, callback} = generateActionSheetOptions(buttons)
    this.props.showActionSheetWithOptions(options, callback)
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    logout: () => dispatch(logout()),
  }
}

export default connect(undefined, mapDispatchToProps)(SettingsSection)

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
})
