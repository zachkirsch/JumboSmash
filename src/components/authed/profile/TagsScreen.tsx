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
import { Tag, TagSectionType, updateTagsLocally } from '../../../services/profile'
import { HeaderBar } from '../../common'
import { JSText } from '../../common/index'
import TagsSection from './TagsSection'

interface ImmutableTagSectionType {
  name: string
  tags: List<Tag>
}

interface State {
  tags: List<ImmutableTagSectionType>
}

interface OwnProps {}

interface StateProps {
  tags: TagSectionType[]
}
interface DispatchProps {
  updateTagsLocally: (tags: TagSectionType[]) => void,
}

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>

class TagsScreen extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      tags: List(props.tags.map(section => ({
        name: section.name,
        tags: List(section.tags),
      }))),
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
              Tap the tags that apply to you.
            </JSText>
            <JSText style={styles.title}>
              Everyone else will see the tags you choose.
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
      if (!section || sectionIndex === undefined) {
        return null
      }
      return (
        <View key={section.name}>
          <JSText bold style={styles.sectionTitle}>{section.name}</JSText>
          <TagsSection
            tags={section.tags.toArray()}
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
    this.props.updateTagsLocally(this.state.tags.map(section => {
      return {
        name: section!.name,
        tags: section!.tags.toArray(),
      }
    }).toArray())
    this.props.navigation.goBack()
  }

  private toggleTag = (sectionIndex: number) => (tagIndex: number) => {
    const tag = this.state.tags.get(sectionIndex).tags.get(tagIndex)
    this.setState({
      tags: this.state.tags.set(
        sectionIndex,
        {
          name: this.state.tags.get(sectionIndex).name,
          tags: this.state.tags.get(sectionIndex).tags.set(tagIndex, {
            ...tag,
            selected: !tag.selected,
          }),
        }
      ),
    })
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    tags: state.profile.tags.localValue || state.profile.tags.value,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    updateTagsLocally: (tags: TagSectionType[]) => dispatch(updateTagsLocally(tags)),
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
})
