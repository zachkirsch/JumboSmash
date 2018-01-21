import React, { PureComponent } from 'react'
import { connect, Dispatch } from 'react-redux'
import { NavigationTabScreenOptions } from 'react-navigation'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { logout } from '../../services/auth'
import { View, Text, StyleSheet, Button} from 'react-native'
import { RootState } from '../../redux'

interface DispatchProps {
  onLogout: () => void
}

type Props = DispatchProps;

class LogOutScreen extends PureComponent<Props, {}> {

  constructor(props: Props){
    super(props);
  }
  static navigationOptions: NavigationTabScreenOptions = {
    tabBarIcon: ({focused, tintColor}) => (
      <FontAwesome
        name={focused ? 'heart' : 'heart-o'}
        size={24}
        style={{ color: tintColor }}
      />
    ),
  }

  public render() {
    return (
         <View style={[styles.container, styles.center]}>
         <View style={{flex:4}}/>
         <Text style={styles.titleText}>Log out? Are you sure?</Text>
         <Button
           onPress = {() => this.props.onLogout()}
           title="Yes"
           color="#841584"
           accessibilityLabel="Yes"
         />
      </View>
    )
  }
};


const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    onLogout: () => dispatch(logout()),
  }
}

export default connect(undefined, mapDispatchToProps)(LogOutScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
center: {
  flex: 1,
  flexDirection: 'column',
  borderBottomColor: '#D3D3D3',
  borderBottomWidth: 1,
  alignItems: 'center',
  padding: 1
},
  titleText:{
    marginTop: 3,
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    color: '#3f3f3f',
    alignSelf: 'center',
  }
})
