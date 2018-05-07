import React, { PureComponent } from 'react'
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { HeaderBar, JSTextInput } from '../../common'
import { JSText } from '../../common/index'

interface State {
  attendeeList: string[]
}

interface OwnProps {
  event: string
  attendees: string[]
}

interface StateProps {

}
interface DispatchProps {
}

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>

class MyReactScreen extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      attendeeList: this.props.navigation.state.params.attendees,
    }
  }

  render() {
    const textChange = (text: string) => this.newSearch(text)
    return (
      <View style={styles.fill}>
        <HeaderBar title='Senior Event RSVPs' onPressLeft={this.props.navigation.goBack}/>
        <ScrollView>
        <View style={styles.searchBarContainer}>
          <JSTextInput
              style={styles.searchBar}
              placeholder='Search...'
              onChangeText={textChange}
          />
        </View>
          <View style={[styles.topContainer]}>
            <JSText style={styles.title}>
              {this.props.navigation.state.params.event}
            </JSText>
            </View>
            <View style={styles.separator}/>
            {this.renderRows()}
        </ScrollView>
      </View>
    )
  }

  private newSearch = (substring: string) => {
    let newList: string[]
    newList = []
    let masterList = this.props.navigation.state.params.attendees
    masterList.map((section) => {
      if (section.indexOf(substring) >= 0) {
        newList.push(section)
      }
    })
    this.setState({attendeeList: newList})
  }

  private renderRows = () => {
    let attendees = this.state.attendeeList
    return attendees.map((section, sectionIndex) => {
      return (
        <View key={sectionIndex}>
        <View style={styles.container}><JSText>{section}</JSText></View>
        <View style={styles.separator} />
        </View>
      )})

  }

}

export default MyReactScreen

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  topContainer: {
    padding: 20,
    backgroundColor: 'rgb(219, 230, 253)',
  },
  search: {
    padding: 10,
  },
  tagSection: {
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  topContainerWithRoomForStatusBar: {
     paddingTop: 28,
   },
   searchBarContainer: {
     flexDirection: 'row',
     alignItems: 'center',
     overflow: 'hidden',
     marginHorizontal: 10,
     marginTop: 10,
     marginBottom: 5,
     backgroundColor: 'rgb(250, 250, 250)',
     borderRadius: 40,
     borderWidth: StyleSheet.hairlineWidth,
     borderColor: 'lightgray',
   },
   searchBar: {
     flex: 1,
     textAlign: 'center',
     marginLeft: 3,
     marginRight: 7,
     paddingVertical: 5,
     paddingHorizontal: 25,
     fontSize: 20,
   },

})
