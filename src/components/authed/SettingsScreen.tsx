import { JSButton, JSText, JSTextInput } from '../generic/index';
import React, { PureComponent } from 'react'
import { View, Text, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { logout } from '../../services/auth'

type Props = NavigationScreenProps<{}>

interface State {
  settingtasks: [{id: number, name: string}],
}

class SettingsScreen extends PureComponent<Props, State> {
  constructor(props: Props) {
     super(props);
     this.state = {
       settingtasks: [{
                id: 0,
                name: 'Tags',
             },{
                id: 1,
                name: 'Code of Conduct',
             },
             {
                id: 2,
                name: 'Reporting',
             },
             {
                id: 3,
                name: 'Block Users',
             },
             {
                id: 4,
                name: 'Logout',
             }]
     }}

  render() {
    return (
      <Modal transparent = {false}>
      <View style={[styles.container, styles.center]}>
        <View>
         {
            this.state.settingtasks.map((item) => (
               <TouchableOpacity key = {item.id}
                  style = {styles.center}>
                  <Text style = {styles.text}>
                     {item.name}
                  </Text>
               </TouchableOpacity>
            ))
         }
         </View>
      <Button onPress={() => this.props.navigation.goBack()} title='Go Back'/>
      </View>
      </Modal>
    )
  }

  }

  export default SettingsScreen

  const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
   text:{
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    color: '#595959',
  },
  })
