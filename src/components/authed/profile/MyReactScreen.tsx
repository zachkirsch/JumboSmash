import React, { PureComponent } from 'react'
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect, Dispatch } from 'react-redux'
import { List } from 'immutable'
import { RootState } from '../../../redux'
import { Tag, TagSectionType, updateTagsLocally, ProfileState } from '../../../services/profile'
import { HeaderBar, RectangleButton, JSButton } from '../../common'
import { JSText } from '../../common/index'
import TagsSection from './TagsSection'
import ReactSection from '../swipe/ReactSection';
import { User } from '../../../services/swipe';
import { FlatList } from 'react-native';

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

class MyTagsScreen extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    const PRO = this.props.navigation.state.params.profile
    this.state = {
      ProfileUser: {
        id: PRO.id,
        preferredName: PRO.preferredName.value,
        surname: "",
        fullName: "",
        major: "",
        bio: "",
        images: [],
        profileReacts: PRO.reacts,
        tags: []
      },
      renderByID: 0,
      renderedUsers: [{id: 1, names: ["Beyonce", "JAY Z", "Kanye West", "Yuki Zaninovich"]}, {id: 2, names: ["Lord Vader"]}
        , {id: 3, names: ["Max Bernstein"]}, {id: 4, names: ["HAHA"]},{id: 5, names: [":()"]},{id: 6, names: [":)"]}]
    }
  }
  render() {
    console.log(this.state.ProfileUser)
    return (
      <View style={styles.fill}>
        <HeaderBar title='Your Reacts' goBack={this.props.navigation.goBack}/>
        <ScrollView>
          <View style={styles.topContainer}>
            <JSText style={styles.title}>
              Tap the icons to see who reacted on your bio!
            </JSText>
            <ReactSection
              profile={this.state.ProfileUser}
              enabled={true}
              ownReacts={true}
              renderNamesFromReactID={(id: number)=>{this.setState({renderByID: id})}}
            />
          </View>
          {this.renderNamesByReact()}
        </ScrollView>
      </View>
    )
  }

  private createNameList = (name: string) => {
    return (
      <View style={}>{name}</View>
    )
  }

  private renderNamesByReact = () => {
    this.state.renderedUsers.map(u => {
      if (this.state.renderByID === u.id){
        return (
          <FlatList
          data={u.names}
          renderItem={this.createNameList(item)}
          />
        )
      } return null
    })
  }

}

const mapStateToProps = (state: RootState): StateProps => {
  return {
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyTagsScreen)

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
    marginHorizontal: 0
  }
})
