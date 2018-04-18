import update from 'immutability-helper'
import React, { PureComponent } from 'react'
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../../redux'
import { TagSectionType, updateTags } from '../../../services/profile'
import { HeaderBar } from '../../common'
import { JSText } from '../../common/index'
import TagsSection from './TagsSection'

interface State {
  tags: TagSectionType[]
}
interface OwnProps {}

interface StateProps {
  tags: TagSectionType[]
}
interface DispatchProps {
  updateTags: (tags: TagSectionType[]) => void,
}

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>

class TagsScreen extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      tags: props.tags,
    }
  }

  componentDidMount() {
    this.props.navigation.addListener('willBlur', this.saveChanges)
  }

  render() {
    return (
      <View style={styles.fill}>
        <HeaderBar title='Choose Tags' goBack={this.props.navigation.goBack} />
        <ScrollView>
          <View style={styles.topContainer}>
            <JSText style={styles.title}>
              Tap the tags that apply to you. When swiping, you will see the tags you have in common with each student.
            </JSText>
          </View>
          <View style={styles.tagsContainer}>
            {this.renderTags()}
          </View>
        </ScrollView>
      </View>
    )
  }

  private renderTags = () => {
    return this.state.tags.map((section, sectionIndex) => {
      return (
        <View key={section.name}>
          <JSText bold fontSize={16}>{section.name}</JSText>
          <TagsSection
            tags={section.tags}
            onPress={this.toggleTag(sectionIndex)}
            tagStyle={styles.tag}
            selectedTagStyle={styles.chosenTag}
            containerStyle={styles.tagSection}
          />
        </View>
      )
    })
  }

  private saveChanges = () => {
    this.props.updateTags(this.state.tags)
    this.props.navigation.goBack()
  }

  private toggleTag = (sectionIndex: number) => (tagIndex: number) => {
    const updateConfig: any = {} /* tslint:disable-line:no-any */
    updateConfig[sectionIndex] = {
      tags: {},
    }
    updateConfig[sectionIndex].tags[tagIndex] = {
      selected: {
        $set: !this.state.tags[sectionIndex].tags[tagIndex].selected,
      },
    }
    this.setState({
      tags: (update(this.state.tags, updateConfig) as TagSectionType[]),
    })
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    tags: state.profile.tags.value,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    updateTags: (tags: TagSectionType[]) => dispatch(updateTags(tags)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TagsScreen)

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
    opacity: 0.6,
  },
  chosenTag: {
    opacity: 1,
  },
  tagSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
  },
  tagsContainer: {
    padding: 20,
  },
})
