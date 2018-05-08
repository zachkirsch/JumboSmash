import React, { PureComponent } from 'react'
import { ScrollView, StyleSheet, View, Alert, Platform } from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect, Dispatch } from 'react-redux'
import { List } from 'immutable'
import { RootState } from '../../../redux'
import { Tag, TagSectionType, updateTags } from '../../../services/profile'
import { goToNextRoute } from '../../navigation'
import { HeaderBar, JSText, JSButton } from '../../common'
import { xor, getMainColor, getLightColor } from '../../../utils'
import TagsSection from './TagsSection'

interface ImmutableTagSectionType {
  name: string
  tags: List<Tag>
}

interface State {
  tags: List<ImmutableTagSectionType>
  tagsModified: boolean
}

interface OwnProps {}

interface StateProps {
  tags: TagSectionType[]
}
interface DispatchProps {
  updateTags: (tags: TagSectionType[]) => void,
}

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps> & {
  setupMode?: boolean
}

class TagsScreen extends PureComponent<Props, State> {

  private initialState: State

  constructor(props: Props) {
    super(props)
    this.state = this.getInitialState()
  }

  render() {
    return (
      <View style={styles.fill}>
        {this.renderHeaderBar()}
        {this.renderTopContainer()}
        <ScrollView>
          <View style={styles.tagsContainer}>
            {this.renderTags()}
          </View>
          {this.props.setupMode && this.renderContinue()}
        </ScrollView>
      </View>
    )
  }

  private renderHeaderBar = () => {

    if (this.props.setupMode) {
      return null
    }
    return (
      <HeaderBar
        title='Choose Tags'
        onPressLeft={this.revert}
        renderLeft={this.renderHeaderLeft}
        onPressRight={this.saveAndGoBack}
        renderRight={this.renderHeaderRight}
      />
    )
  }

  private renderHeaderLeft = () => {
    return (
      <JSText style={styles.headerBarSideText}>Cancel</JSText>
    )
  }

  private renderHeaderRight = () => {
    return (
      <JSText style={styles.headerBarSideText}>Save</JSText>
    )
  }

  private renderTopContainer = () => {
    const containerStyle = [styles.topContainer]
    if (this.props.setupMode && Platform.OS === 'ios') {
      containerStyle.push(styles.topContainerWithRoomForStatusBar)
    }

    return (
      <View style={containerStyle}>
        <JSText style={styles.title}>
          Tap the tags that apply to you!
        </JSText>
        <JSText style={styles.title}>
          Everyone else will see the tags you choose.
        </JSText>
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

  private renderContinue = () => {
    return (
      <View style={styles.continue}>
        <JSButton label='Continue' onPress={this.goToNextRoute} />
      </View>
    )
  }

  private goToNextRoute = () => {
    this.saveChanges()
    goToNextRoute(this.props.navigation)
  }

  private saveChanges = () => {
    if (this.saveRequired()) {
      this.props.updateTags(
        this.state.tags.map(section => {
          return {
            name: section!.name,
            tags: section!.tags.toArray(),
          }
        }).toArray()
      )
    }
  }

  private saveAndGoBack = () => {
    this.saveChanges()
    this.props.navigation.goBack()
  }

  private saveRequired = () => {
    return !!this.props.tags.find((section, i) => {
      return !!section.tags.find((tag, j) => {
        return xor(tag.selected, this.state.tags.get(i).tags.get(j).selected)
      })
    })
  }

  private revert = () => {
    if (this.saveRequired()) {
      Alert.alert(
        '',
        'Are you sure you want to revert your changes?',
        [
          {text: 'No', style: 'cancel'},
          {text: 'Yes', style: 'destructive', onPress: this.props.navigation.goBack},
        ]
      )
    } else {
      this.props.navigation.goBack()
    }
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

  private getInitialState = () => {
    if (this.initialState) {
      return this.initialState
    }
    return {
      tagsModified: false,
      tags: List(this.props.tags.map(section => ({
        name: section.name,
        tags: List(section.tags),
      }))),
    }
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
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: 'rgb(250, 250, 250)',
    ...Platform.select({
      ios: {
        shadowColor: 'lightgray',
        shadowRadius: 5,
        shadowOpacity: 1,
      },
    }),
  },
  topContainerWithRoomForStatusBar: {
    paddingTop: 28,
  },
  tag: {
    color: 'black',
    paddingVertical: 2.5,
    fontSize: 16,
    opacity: 0.6,
  },
  chosenTag: {
    opacity: 1,
    shadowColor: getLightColor(),
    shadowOpacity: 1,
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
    color: getMainColor(),
  },
  button: {
    paddingVertical: 5,
  },
  saveOrRevertContainer: {
    paddingVertical: 5,
  },
  continue: {
    marginBottom: 20,
    marginHorizontal: 20,
  },
  headerBarSideText: {
    color: getMainColor(),
    fontSize: 15,
  },
})
