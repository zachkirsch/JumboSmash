import React, { PureComponent } from 'react'
import { connect, Dispatch } from 'react-redux'
import { View, Text, TextInput, Button, StyleSheet, Image} from 'react-native'
import { NavigationTabScreenOptions } from 'react-navigation'
import { Icon } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { logout } from '../../services/auth'
import { RootState } from '../../redux'

interface DispatchProps {
  onLogout: () => void
}

type Props = DispatchProps
interface State {
  bio: string
}

class ProfileScreen extends PureComponent<Props, State> {

  constructor(props: Props) {
     super(props);
     this.state = { bio: 'Useless Placeholder' };
   }


  static navigationOptions: NavigationTabScreenOptions = {
    tabBarIcon: ({focused, tintColor}) => (
      <Ionicons
        name={focused ? 'ios-person' : 'ios-person-outline'}
        size={35}
        style={{ color: tintColor }}
      />
    ),
  }

  render() {
    return (

      <View style={{flex: 1, marginTop: 8, flexDirection: 'column', backgroundColor: '#EFEFEF'}}>
            <View style={[styles.center]}>
                <Text></Text>
                <Text style={styles.titleText}>Edit Info</Text>
            </View>
            <View style={{flex: 4, flexDirection: 'row', borderBottomColor: '#D3D3D3',
            borderBottomWidth: 3}}>
              <View style={{flex: 4, margin: 4, justifyContent: 'flex-end', backgroundColor: 'steelblue'}}>

              <View style={{alignSelf: 'flex-end'}}><Icon name='add-circle' size={50} color='#EFEFEF'/></View>
              </View>
              <View style={{flex: 2, margin: 4, marginTop: 4, backgroundColor: '#EFEFEF'}} >
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', backgroundColor: 'midnightblue'}}>
                      <View style={{alignSelf: 'flex-end'}}><Icon name='add-circle' size={30} color='#EFEFEF'/></View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', backgroundColor: 'steelblue'}}>
                      <View style={{alignSelf: 'flex-end'}}><Icon name='add-circle' size={30} color='#EFEFEF'/></View>
                    </View>
              </View>
            </View>
            <View style={{flex: 1, marginTop: 8, flexDirection: 'column', borderBottomColor: '#D3D3D3',  borderBottomWidth: 1}} >
              <View style={[styles.textContainer]}>
                    <Text style={styles.titleText}>Dummy Profile, 22</Text>
              </View>
              <View style={[styles.textContainer]}>
              </View>
            </View>
            <View style={{flex: 4, flexDirection: 'row'}} >
                <View style={{flex: 4, flexDirection: 'column'}}>
                    <Text style={styles.typeText}></Text>
                    <View style={[styles.textContainer]}>
                      <Text style={styles.typeText}>Bio</Text>
                      <View style={{padding: 10}}>
                          <TextInput
                            style={styles.bioText}
                            placeholder="Insert witty bio here"
                            onChangeText={(bio) => this.setState({bio})}
                          />
                      </View>
                    </View>
                </View>
            </View>
            <View style={{flex: 1, flexDirection: 'row'}} >
                <View style={[styles.container, styles.center]}>
                    <Button onPress={this.props.onLogout} title='Logout'/>
                </View>
            </View>
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    onLogout: () => dispatch(logout()),
  }
}

export default connect(undefined, mapDispatchToProps)(ProfileScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
  },
  center: {
    flexDirection: 'column',
    borderBottomColor: '#D3D3D3',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  textContainer: {
    flex: 2,
    flexDirection: 'column',
    backgroundColor: 'white'
  },
  titleText:{
    marginTop: 3,
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    color: '#3f3f3f',
    alignItems: 'center',
  },
  typeText:{
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    color: '#595959',
  },
  bioText: {
    fontSize: 18,
    fontFamily: 'Helvetica'
  }
})
