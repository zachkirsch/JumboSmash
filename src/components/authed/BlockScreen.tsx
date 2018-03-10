import React, { PureComponent } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { JSText, JSButton, JSTextInput } from '../generic/index';

interface State {
  blocked_users: Array<string>,
  additionalemail: string,
}

const TUFTS_EMAIL_REGEX = /^(.*@tufts\.edu)$/

type Props = {}

class BlockScreen extends PureComponent<Props, State> {

  constructor(props: Props) {
     super(props);
     this.state = {
       blocked_users: ['bad.dude@tufts.edu', 'total.creep@tufts.edu'],
       additionalemail: ''
     }
   }

  render() {
       return (
         <ScrollView>
         <View style={styles.bio}>
           <JSText style={styles.subtitle}>Block Users</JSText>
           <JSText style={styles.title}>Block anyone without seeing their profile: </JSText>
           <JSText style={styles.title}>just input their Tufts email below.</JSText>
         </View>
         <View
           style={{
             borderBottomColor: 'grey',
             borderBottomWidth: 1,
           }}
         />
         <View style={styles.bio}>
         <JSTextInput placeholder="firstname.lastname@tufts.edu"
           onChangeText = {(email) => {this.setState({additionalemail: email})}}
           onSubmitEditing ={() => this.addUser(this.state.additionalemail)}></JSTextInput>
           <View style={styles.bio}>
           <View style={styles.buttons}>
            <JSButton onPress= {() => this.addUser(this.state.additionalemail)} label="Add User"></JSButton>
           </View>
           </View>
         </View>
         <View style={styles.bio}>
            <View style={styles.bioItem}>
            <JSText style={styles.subtitle}> Already Blocked:</JSText>
           {this.state.blocked_users.map((user) =>
             (<JSText style={styles.tags} key={user}>
               {user} </JSText>))}
               </View>
           </View>
           <View style={styles.bio}></View>
           <View style={styles.buttons}>
             <JSButton onPress={() => this.props.navigation.goBack()} label="Save Changes"></JSButton>
           </View>
           <View style={styles.buttons}>
             <JSButton onPress={() => this.props.navigation.goBack()} label="Cancel"></JSButton>
           </View>
         </ScrollView>
       )
     }

     private addUser(email: string){
       if (this.state.blocked_users.includes(email)){
         return
       } else {
         if (TUFTS_EMAIL_REGEX.test(email)){
            this.setState({blocked_users: this.state.blocked_users.concat([email])})
         }
         return
       }
     }
}

export default BlockScreen


const styles = StyleSheet.create({
  buttons:{
    flex: 1,
    justifyContent: 'space-around',
    paddingVertical: 1,
  },
  bioItem:{
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  bio: {
    flex: 8,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  tags:{
    fontSize: 16,
    color: 'grey',
    alignSelf: 'flex-start'
  },
  highlightedTags:{
    fontSize: 16,
    textDecorationLine: 'underline',
    color: '#171767',
  },
  reactRow:{
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    paddingVertical: 10,
    alignItems: 'flex-start',
    alignSelf: 'flex-start'
  },
  title: {
    fontSize: 40,
    alignSelf: 'center'
  },
  subtitle:{
    fontSize: 12,
    fontWeight: 'bold', alignSelf: 'center'
  }
})
