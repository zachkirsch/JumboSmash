import React, { PureComponent } from 'react'
import {
  StyleSheet,
  View,
  FlatList,
} from 'react-native'
import { Map } from 'immutable'
import { NavigationScreenPropsWithOwnProps } from 'react-navigation'
import { ProfileReact, IndividualProfileReact } from '../../../services/profile'
import { HeaderBar, JSImage, JSText, ReactSection } from '../../common'
import { User } from '../../../services/swipe'

interface State {
  selectedReactId: number
}

interface OwnProps {
  allUsers: Map<number, User>
  profileReacts: ProfileReact[]
  whoReacted: IndividualProfileReact[]
}

type Props = NavigationScreenPropsWithOwnProps<OwnProps>

class MyReactScreen extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    let toChooseFrom = this.getOwnProps().profileReacts.filter(r => r.count)
    if (toChooseFrom.length === 0) {
      toChooseFrom = this.getOwnProps().profileReacts
    }
    const startingReact = toChooseFrom[Math.floor(Math.random() * toChooseFrom.length)]
    this.state = {
      selectedReactId: startingReact && startingReact.id,
    }
  }
  render() {
    if (this.getOwnProps().profileReacts.length === 0) {
      return null
    }
    const reacts = this.getOwnProps().profileReacts.map(react => ({
      ...react,
      reacted: react.id === this.state.selectedReactId,
    }))

    return (
      <View style={styles.fill}>
        <HeaderBar title='My Reacts' onPressLeft={this.props.navigation.goBack}/>
        <ReactSection
          reacts={reacts}
          onPressReact={this.onPressReact}
        />
        <FlatList
          data={this.getUsers()}
          renderItem={this.renderItem}
          style={{flexGrow: 1}}
          keyExtractor={this.extractUserId}
        />
      </View>
    )
  }

  private renderItem = ({item}: {item: User}) => {
    if (!item) {
      return null
    }
    let name = item.fullName
    let avatar = item.images[0]
    let image = <View style={[styles.image, styles.blankImage]} />
    if (avatar) {
      image = <JSImage cache source={{uri: avatar}} style={styles.image}/>
    }
    return (
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', padding: 8}}>
        {image}
        <JSText style={{fontSize: 16}}>{name}</JSText>
      </View>
    )
  }

  private extractUserId = (user: User) => user.id.toString(10)

  private getUsers = () => {
    return this.getOwnProps()
      .whoReacted
      .filter(react => react.reactId === this.state.selectedReactId)
      .map(react => this.getOwnProps().allUsers.get(react.byUser))
      .filter(u => !!u)
  }

  private onPressReact = (react: ProfileReact) => {
    this.setState({
      selectedReactId: react.id,
    })
  }

  private getOwnProps = () => this.props.navigation.state.params

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
  image: {
    width: 26,
    height: 26,
    marginRight: 10,
    borderRadius: 13,
  },
  blankImage: {
    backgroundColor: 'rgb(240, 240, 240)',
  },
})
