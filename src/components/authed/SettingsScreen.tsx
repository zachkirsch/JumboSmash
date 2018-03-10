import React, { PureComponent } from 'react'
import { connect, Dispatch } from 'react-redux'
import { Alert, View, StyleSheet} from 'react-native'
import { JSButton } from '../generic/index';
import { logout } from '../../services/auth'
import { connectActionSheet } from '@expo/react-native-action-sheet';
import { RootState } from '../../redux'

interface State {
  bio: string,
}
interface OwnProps {
  onLogout: () => void
  Block: () => void
  CoC: () => void
  Report: () => void
}

type Props = connectActionSheet<OwnProps>

@connectActionSheet
class SettingsMenu extends PureComponent<Props,State> {
  constructor(props: Props) {
     super(props);
     this.state = { bio: "I don't know why this is here, maybe take it out",}
  }

  render(){
    return (
      <View>
      <View style={styles.buttons}>
        <JSButton label="Help/Feedback" onPress={this._onOpenHelpSheet}></JSButton>
      </View>
      <View style={styles.buttons}>
        <JSButton label="Settings" onPress={this._onOpenSettingsSheet} ></JSButton>
      </View>
      </View>
    )
  }

  private _onOpenSettingsSheet = () => {
  // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    let options = ['Log Out', 'Deactivate Account', 'Cancel'];
    let destructiveButtonIndex = 1;
    let cancelButtonIndex = 2;

    this.props.showActionSheetWithOptions({
      options,
      cancelButtonIndex,
      destructiveButtonIndex,
    },
    (buttonIndex: number) => {
      switch(buttonIndex) {
        case 0:
            Alert.alert("Logout", "Are you sure you want to log out?",
            [
              {text: 'Yes', onPress: () => this.props.onLogout()},
              {text: 'No', style: 'cancel'}
            ],)
            break
        case 1:
            Alert.alert("Deactivate My Account", "This will prevent others from seeing your profile until you log back in again.",
            [
              {text: 'Deactivate', onPress: () => this.props.onLogout()},
              {text: 'Nvm', style: 'cancel'}
            ],)
            break;
      }
    });

  }
  private _onOpenHelpSheet = () => {
  // TODO: after one use everything gets fucked.
  //
    let options = ['Reporting / Feedback', 'Block / Avoid User', 'Code of Conduct', 'Cancel'];
    let destructiveButtonIndex = 1;
    let cancelButtonIndex = 3;

    this.props.showActionSheetWithOptions({
      options,
      cancelButtonIndex,
      destructiveButtonIndex,
    },
    (buttonIndex: number) => {
      switch(buttonIndex) {
        case 0:
            this.props.Report()
            break;
        case 1:
            this.props.Block()
            break;
        case 2:
            this.props.CoC()
            break;
      }
    });

  }
}
const mapDispatchToProps = (dispatch: Dispatch<RootState>): OwnProps => {
  return {
    onLogout: () => dispatch(logout()),
    goBack: () => this.props.goBack(),

  }
}

export default connect(undefined, mapDispatchToProps)(SettingsMenu)


const styles = StyleSheet.create({
  buttons:{
    flex: 1,
    justifyContent: 'space-around',
    paddingVertical: 1,
  },
})
