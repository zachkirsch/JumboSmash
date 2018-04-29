import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import { NavigationScreenPropsWithOwnProps } from 'react-navigation'
import { User } from '../../../services/swipe'
import { SwipeScreen } from '../swipe'
import { isIphoneX } from '../../../utils'

interface OwnProps {
  preview: User
}

interface State {

}

type Props = NavigationScreenPropsWithOwnProps<OwnProps>

class ProfilePreviewScreen extends PureComponent<Props, State> {
  render() {
    return (
      <View style={styles.container}>
        <SwipeScreen
          preview={{ user: this.props.navigation.state.params.preview, onExit: this.props.navigation.goBack }}
        />
      </View>
    )
  }
}

export default ProfilePreviewScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: isIphoneX() ? 40 : 0,
    backgroundColor: 'black',
  },
})
