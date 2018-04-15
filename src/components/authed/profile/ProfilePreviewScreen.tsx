import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { NavigationScreenPropsWithOwnProps } from 'react-navigation'
import {  User } from '../../../services/swipe'
import { SwipeScreen } from '../swipe'

interface OwnProps {
  preview: User
}

interface State {

}

type Props = NavigationScreenPropsWithOwnProps<OwnProps>

class ProfilePreviewScreen extends PureComponent<Props, State> {
  render() {
    return (
      <View style={{flex: 1}}>
        <SwipeScreen
          preview={{ user: this.props.navigation.state.params.preview, onExit: this.props.navigation.goBack }}
        />
      </View>
    )
  }
}

export default ProfilePreviewScreen
