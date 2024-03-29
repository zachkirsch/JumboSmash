import { ActionSheetProps, connectActionSheet } from '@expo/react-native-action-sheet'
import React, { PureComponent } from 'react'
import { Alert, StyleSheet, View} from 'react-native'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../../redux'
import { logout, deactivate } from '../../../services/auth'
import { RectangleButton } from '../../common/index'
import { ActionSheetOption, reportUser, sendFeedback, generateActionSheetOptions } from '../../../utils'

interface OwnProps {
  previewProfile: () => void
  block: () => void
  viewCoC: () => void
  startSmashing?: () => void
}

interface StateProps {

}

interface DispatchProps {
  logout: () => void
  deactivate: () => void
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
        {this.renderStartSmashingButton()}
        <RectangleButton
          label={'Report / Block'}
          onPress={this.openHelpActionSheet}
        />
        <RectangleButton
          label='Logout'
          onPress={this.openSettingsActionSheet}
        />
      </View>
    )
  }

  private renderStartSmashingButton = () => {
    if (!this.props.startSmashing) {
      return null
    }
    return (
      <RectangleButton
        active
        label={'Start Smashing'}
        onPress={this.props.startSmashing}
      />
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
          'Deactivate Account',
          'This will prevent others from seeing your profile until you log back in again.',
          [
            {text: 'Deactivate', onPress: this.props.deactivate },
            {text: 'Cancel', style: 'cancel'},
          ]
        )
      },
    })

    const {options, callback} = generateActionSheetOptions(buttons)
    this.props.showActionSheetWithOptions!(options, callback)
  }

  private openHelpActionSheet = () => {

    const buttons: ActionSheetOption[] = []

    // REPORT USER
    buttons.push({
      title: 'Report User',
      onPress: reportUser,
    })

    // BLOCK USER
    buttons.push({
      title: 'Blocked Users',
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
      onPress: sendFeedback,
    })

    const {options, callback} = generateActionSheetOptions(buttons)
    this.props.showActionSheetWithOptions!(options, callback)
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    logout: () => dispatch(logout()),
    deactivate: () => dispatch(deactivate()),
  }
}

export default connect(undefined, mapDispatchToProps)(SettingsSection)

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
})
