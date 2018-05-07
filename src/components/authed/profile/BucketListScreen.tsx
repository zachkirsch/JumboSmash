import React, { PureComponent } from 'react'
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import {CheckBox } from 'react-native-elements'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { HeaderBar } from '../../common'
import { JSText } from '../../common/index'

interface BucketList {title: string, items: string[], checked: boolean[]}

interface State {
  checkedList: BucketList[]
}

interface OwnProps {
  SeniorBucketList: BucketList[]
  newList: (list: BucketList[]) => void
}

interface StateProps {

}
interface DispatchProps {
}

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>

class BucketListScreen extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      checkedList: this.props.navigation.state.params.SeniorBucketList,
    }
  }

  render() {
    const SENIORBUCKET = this.props.navigation.state.params.SeniorBucketList
    return (
      <View style={styles.fill}>
        <HeaderBar title='My Bucket List' onPressLeft={this.props.navigation.goBack}/>
          <View style={[styles.topContainer, styles.topContainerWithRoomForStatusBar]}>
            <JSText style={styles.title}>
              Try to complete all the items before graduation! All clicked items show up on your profile screen (but not on your card).
            </JSText></View>
            <ScrollView>
              <View style={styles.separator}/>
              {this.renderList(SENIORBUCKET)}
            <View style={[styles.topContainer]}>
              <JSText> Please be safe and responsible! 💕 JumboSmash does not condone illegal activity
               and is not responsible for repercussions for the above actions. </JSText>
            </View>
            </ScrollView>
            </View>
    )
  }
  private renderList = (dataList: BucketList[]) => {
    return dataList.map((section, sectionIndex) => {
      return (
        <View key={sectionIndex} style={styles.paddingBottom}>
        <JSText bold style={styles.sectionTitle}>{section.title}</JSText>
          {this.renderRows(section.items, sectionIndex)}
          <View style={styles.separator} />
        </View>
      )
    })
  }

  private renderRows = (dataList: string[], index: number) => {
    return dataList.map((section, sectionIndex) => {
      return (
      <View key={sectionIndex}>
      <View style={styles.container}>
      <CheckBox title={section}
      containerStyle={styles.bucketListContainer}
      onPress={() => this.toggleListItem(index, sectionIndex)}
      checked={this.state.checkedList[index].checked[sectionIndex]}/>
      </View>
      </View>)
    })
  }

  private toggleListItem = (index: number, sectionIndex: number)  => {
    let newBucketList = this.props.navigation.state.params.SeniorBucketList
    newBucketList[index].checked[sectionIndex] = !newBucketList[index].checked[sectionIndex]
    this.setState({checkedList: newBucketList})  // This works, uncertain as to why the frontend doesn't show up as checked...
    return this.props.navigation.state.params.newList(newBucketList)

  }

}

export default BucketListScreen

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  topContainer: {
    padding: 20,
    backgroundColor: 'rgb(250, 250, 250)',
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    color: 'rgb(172,203,238)',
    padding: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    backgroundColor: 'white',
  },
  bucketListContainer: {
    backgroundColor: 'white',
    borderColor: 'white',
    paddingBottom: 1,
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  paddingBottom: {
    marginBottom: 10,
  },
  separator: {
    flex: 1,
    marginTop: 20,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgb(172,203,238)',
  },
   topContainerWithRoomForStatusBar: {
      paddingTop: 28,
    },
})
