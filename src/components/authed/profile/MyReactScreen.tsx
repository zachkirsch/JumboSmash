import React, { PureComponent } from 'react'
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { ProfileState, ProfileReact } from '../../../services/profile'
import { HeaderBar } from '../../common'
import { JSText } from '../../common/index'
import ReactSection from '../swipe/ReactSection'
import { User } from '../../../services/swipe'

interface UserList {id: number, names: string[]}

interface State {
  ProfileUser: User
  renderByID: number
  renderedUsers: UserList[]
}

interface OwnProps {
  profile: ProfileState
}

interface StateProps {

}
interface DispatchProps {
}

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>

class MyReactScreen extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    const PRO = this.props.navigation.state.params.profile
    this.state = {
      ProfileUser: {
        id: PRO.id,
        preferredName: PRO.preferredName.value,
        surname: '',
        fullName: '',
        major: '',
        email: '',
        classYear: 18,
        profileReacts: PRO.profileReacts,
        bio: '',
        images: [],
        tags: [],
        firebaseUid: '1',
      },
      renderByID: 0,
      renderedUsers: [{id: 1, names: ['Beyonce', 'JAY Z', 'Kanye West', 'Yuki Zaninovich', 'Kanye West']},
       {id: 2, names: ['Lord Vader']}, {id: 3, names: ['Max Bernstein']},
       {id: 4, names: ['HAHA']}, {id: 5, names: [':()']}, {id: 6, names: [':)']}],
    }
  }
  render() {
    const pressReact = (reacts: ProfileReact[]) => () => {this.setState({renderByID: reacts[0].id})}
    return (
      <View style={styles.fill}>
        <HeaderBar title='My Reacts' onPressLeft={this.props.navigation.goBack}/>
        <ScrollView>
          <View style={styles.topContainer}>
            <JSText style={styles.title}>
              Tap the icons to see who reacted on your bio!
            </JSText>
            <ReactSection
              profile={this.state.ProfileUser}
              enabled={true}
              react={pressReact}
            />
            </View>
          {this.renderNamesByReact()}
        </ScrollView>
      </View>
    )
  }

  private renderRows = (dataList: string[]) => {
    return dataList.map((section, sectionIndex) => {
      return (
      <View key={sectionIndex}>
      <View style={styles.container}><JSText>{section}</JSText></View>
      <View style={styles.separator} />
      </View>)
    })
  }

  private renderNamesByReact = () => {

    let id = this.state.renderByID - 1
    if (this.state.renderByID !== 0) {
      return (
        <View>
        {this.renderRows(this.state.renderedUsers[id].names)}
        </View>
      )
    } return null

  }

}

export default MyReactScreen

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  topContainer: {
    padding: 20,
    backgroundColor: 'rgb(250, 250, 250)',
  },
  tag: {
    color: 'black',
    marginBottom: 5,
    fontSize: 16,
    opacity: 0.6,
  },
  chosenTag: {
    opacity: 1,
  },
  tagSection: {
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
  },
  tagsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    color: 'rgb(172,203,238)',
  },
  saveButton: {
    flex: 0.1,
    marginHorizontal: 0,
  },
  container: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  photo: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
})
