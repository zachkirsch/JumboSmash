import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { NavigationScreenPropsWithOwnProps } from 'react-navigation'
import { HeaderBar } from '../../common'
import { CodeOfConductScreen } from '../../login'

interface OwnProps {

}

interface State {

}

type Props = NavigationScreenPropsWithOwnProps<OwnProps>

class ReviewCoCScreen extends PureComponent<Props, State> {
  render() {
    return (
      <View style={{flex: 1}}>
        <HeaderBar title='Code of Conduct' onPressLeft={this.props.navigation.goBack}/>
        <CodeOfConductScreen reviewing />
      </View>
    )
  }
}

export default ReviewCoCScreen
