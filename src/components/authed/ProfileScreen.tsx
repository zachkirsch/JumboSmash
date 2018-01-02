import React, { PureComponent } from 'react'
import { connect, Dispatch } from 'react-redux'
import { Modal, View, Text, TextInput, Button, StyleSheet, /*Image, CameraRoll*/} from 'react-native'
import { NavigationTabScreenOptions } from 'react-navigation'
import { Icon } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { logout } from '../../services/auth'
import { RootState } from '../../redux'
/*import ImagePicker from 'react-native-image-picker'*/

//TODO: CAMERA ROLL, BACKEND PERSISTENCE, Name editing (?), ADDITIONAL FEATURES (TAGS, etc?)

interface DispatchProps {
  onLogout: () => void
}

type Props = DispatchProps
interface State {
  bio: string,
  avatarSource: string,
  name: string,
  age: number,
  modalVisible: boolean
}

class ProfileScreen extends PureComponent<Props, State> {

  constructor(props: Props) {
     super(props);
     this.state = { bio: 'Insert witty bio here.',
                    avatarSource: 'none',
                    name: 'Dummy Name',
                    age: 21,
                    modalVisible: false
                  };
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
            {this.renderTopBar() //TODO: for some reason the top bar isn't working
            }
            {this.renderProfilePictures()}
            {this.renderNameSection()}
            {this.renderBioSection()}
            {this.renderLogoutSection()}
      </View>
    )
  }

/*********************** HELPER FUNCTIONS FOR RENDERING ***********************/
  private renderNameSection = () => {
    return <View style={{flex: 1.3, marginTop: 8, flexDirection: 'column', borderBottomColor: '#D3D3D3',  borderBottomWidth: 1}} >
      {this.renderName()}
      {this.renderNameEdit()}
    </View>
  }

  private renderBioSection = () => {
    return <View style={{flex: 4, flexDirection: 'row'}} >
        <View style={{flex: 4, flexDirection: 'column'}}>
            <Text style={styles.typeText}></Text>
            {this.renderBio()}
        </View>
    </View>
  }
  private renderTopBar = () => {
    return <View style={[styles.center]}><Text></Text>
        <Text style={styles.titleText}>Edit Info</Text>
        </View>
  }
  private renderProfilePictures = () => {
        return <View style={{flex: 4, flexDirection: 'row', borderBottomColor: '#D3D3D3',
            borderBottomWidth: 3}}>
                    <View style={{flex: 4, margin: 4, justifyContent: 'flex-end', backgroundColor: 'steelblue'}}>
                        <View style={{alignSelf: 'flex-end'}}><Icon name='add-circle' size={50} color='#EFEFEF'
                              onPress={() => {
                               //TODO: INSERT CAMERA ROLL
                              }}
                        /></View>
                    </View>
                    <View style={{flex: 2, margin: 4, marginTop: 4, backgroundColor: '#EFEFEF'}} >
                          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', backgroundColor: 'midnightblue'}}>
                            <View style={{alignSelf: 'flex-end'}}><Icon name='add-circle' size={30} color='#EFEFEF'
                                  onPress={() => {
                                   //TODO: INSERT CAMERA ROLL
                                  }}
                            /></View>
                          </View>
                          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', backgroundColor: 'steelblue'}}>
                            <View style={{alignSelf: 'flex-end'}}><Icon name='add-circle' size={30} color='#EFEFEF'
                                  onPress={() => {
                                   //TODO: INSERT CAMERA ROLL
                                  }}
                            /></View>
                          </View>
                    </View>
            </View>
    }

    private renderName = () => {
      return <View style={[styles.textContainer]}>
            <Text style={styles.titleText}>{this.state.name}, {this.state.age}</Text>
      </View>
    }

    private renderNameEdit = () => {
        return <View style={[styles.textContainer]}>
              <View style={{flex: 2, flexDirection: 'row'}}>
              <Button
                onPress={this.props.onLogout} //TODO: CHANGE THIS TO CHANGE NAME.
                title="Edit Name"
                color="#841584"

                accessibilityLabel="Edit your name!"
              />
              </View>
          </View>
    }

    private renderBio = () => {
      return <View style={[styles.textContainer]}>
        <Text style={styles.typeText}>Bio</Text>
        <View style={{padding: 10}}>
            <TextInput
              style={styles.bioText}
              placeholder={this.state.bio}
              onChangeText={(bio) => this.setState({bio})}
            />
        </View>
      </View>
    }

    private renderLogoutSection = () => {
      return <View style={{flex: 1, flexDirection: 'row'}} >
          <View style={[styles.container, styles.center]}>
              <Button onPress={this.props.onLogout} title='Logout'/>
          </View>
      </View>
    }
/*****************************************************************************/
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
