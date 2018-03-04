import React, { PureComponent } from 'react'
import { connect, Dispatch } from 'react-redux'
import { View, StyleSheet} from 'react-native'
import { JSButton } from '../generic/index';
import { logout } from '../../services/auth'
import { connectActionSheet } from '@expo/react-native-action-sheet';
import {emailSupport} from '../login/utils'
import { RootState } from '../../redux'
import { NavigationScreenProps } from 'react-navigation'

interface State {
  bio: string,
}
interface OwnProps {
  onLogout: () => void
}

type Props = NavigationScreenProps<OwnProps>

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
        <JSButton label="Settings" onPress={this._onOpenSettingsSheet} ></JSButton>
      </View>
      <View style={styles.buttons}>
        <JSButton label="Help/Feedback" onPress={this._onOpenHelpSheet}></JSButton>
      </View>
      </View>
    )
  }

  private _onOpenSettingsSheet = () => {
  // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    let options = ['Notifications', 'Log Out', 'Deactivate Account', 'Cancel'];
    let destructiveButtonIndex = 2;
    let cancelButtonIndex = 3;

    this.props.showActionSheetWithOptions({
      options,
      cancelButtonIndex,
      destructiveButtonIndex,
    },
    (buttonIndex: number) => {
      switch(buttonIndex) {
        case 1:
            //Notifications
            break;
        case 2:
            this.props.onLogout()
            break;
        case 3:
            //Deactivate Account
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
        case 1:
            emailSupport("FEEDBACK/REPORTING"); //PUT IN A PAGE, and then start reporting.
            break;
        case 2:
            //Block User
            break;
        case 3:
            this.props.navigation.navigate('CoCPrivacyScreen')
            break;
      }
    });

  }
}
const mapDispatchToProps = (dispatch: Dispatch<RootState>): OwnProps => {
  return {
    onLogout: () => dispatch(logout()),
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
