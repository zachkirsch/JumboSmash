import React, { PureComponent } from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../../redux'
import { HeaderBar, JSText } from '../../common'
import { updateBucketList, BucketListItem, BucketListCategory } from '../../../services/profile'
import Checklist from './Checklist'

interface State {
  currentItems: BucketListCategory[]
}

interface StateProps {
  bucketList: BucketListCategory[]
}

interface DispatchProps {
  updateBucketList: (items: BucketListCategory[]) => void
}

type Props = NavigationScreenPropsWithRedux<{}, StateProps & DispatchProps>

class EventsScreen extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      currentItems: this.props.bucketList,
    }
  }

  componentDidMount() {
    this.props.navigation.addListener('willBlur', () => {
      this.saveChanges()
    })
  }

  render() {
    return (
      <View style={styles.fill}>
        {this.renderHeaderBar()}
        {this.renderTopContainer()}
        <Checklist
          sections={this.getBucketListItems()}
          keyExtractor={this.extractIdFromItem}
          labelExtractor={this.extractNameFromItem}
          isChecked={this.itemCompleted}
          onPressCheckbox={this.toggleItem}
        />
      </View>
    )
  }

  private renderHeaderBar = () => {
    return (
      <HeaderBar
        title='Bucket List'
        onPressLeft={this.props.navigation.goBack}
      />
    )
  }

  private renderTopContainer = () => {
    return (
      <View style={styles.topContainer}>
        <JSText style={styles.title}>
          Don't worry, nobody else will see this list :)
        </JSText>
      </View>
    )
  }

  private getBucketListItems = () => {
    return this.state.currentItems.map(category => ({
      title: category.name,
      data: category.items,
    }))
  }

  private extractIdFromItem = (item: BucketListItem) => item.id.toString(10)
  private extractNameFromItem = (item: BucketListItem) => item.text
  private itemCompleted = (item: BucketListItem) => item.completed

  private saveChanges = () => {
    if (this.saveRequired()) {
      this.props.updateBucketList(this.state.currentItems)
    }
  }

  private saveRequired = () => {
    return !!this.props.bucketList.find((category, categoryIndex) => {
      return !!category.items.find((item, itemIndex) => {
        const completedInState = this.state.currentItems[categoryIndex].items[itemIndex].completed
        return completedInState !== item.completed
      })
    })
  }

  private toggleItem = (item: BucketListItem) => {
    this.setState({
      currentItems: this.state.currentItems.map(category => {
        if (category.name !== item.category) {
          return category
        }
        return {
          ...category,
          items: category.items.map(other => {
            if (item.id !== other.id) {
              return other
            }
            return {
              ...other,
              completed: !other.completed,
            }
          }),
        }
      }),
    })
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    bucketList: state.profile.bucketList.value,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    updateBucketList: (items: BucketListCategory[]) => dispatch(updateBucketList(items)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventsScreen)

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
  title: {
    textAlign: 'center',
  },
})
