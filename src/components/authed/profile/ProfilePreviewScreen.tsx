import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import { NavigationScreenPropsWithOwnProps } from 'react-navigation'
import { User } from '../../../services/swipe'
import { SwipeScreen } from '../swipe'
import { isIphoneX } from '../../../utils'

type OwnProps = { type: 'self', profile: User } | { type: 'other', userId: number }

type Props = NavigationScreenPropsWithOwnProps<OwnProps>

class ProfilePreviewScreen extends PureComponent<Props, {}> {
  render() {
    return (
      <View style={styles.container}>
        <SwipeScreen
          preview={{...this.props.navigation.state.params, onExit: this.props.navigation.goBack}}
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
  },
})
