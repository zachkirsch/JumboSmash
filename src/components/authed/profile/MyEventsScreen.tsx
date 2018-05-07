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
    const textChange = (text: string) => () => this.newSearch(text)
    return (
      <View style={styles.fill}>
        <HeaderBar title='Senior Event RSVPs' onPressLeft={this.props.navigation.goBack}/>
        <ScrollView>
        <View style={styles.search}>
          <JSTextInput
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
    masterList.map((section, sectionIndex) => {
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
  namesContainer: {
    paddingLeft: 10,
  },
  title: {
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    color: 'rgb(172,203,238)',
    paddingTop: 10,
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
   imageReact: {
     width: 25,
     height: 25,
     justifyContent: 'center',
   },
   emoji: {
     fontSize: 23,
   },
   reactColumn: {
     height: 120,
     flex: 1,
     justifyContent: 'space-around',
     padding: 5,
   },
   date: {
     fontSize: 15,
     paddingTop: 10,
     color: 'rgb(172,203,238)',
     flex: 1,
     alignSelf: 'center',
   },
   reacts: {
     flex: 1,
     flexDirection: 'row',
     justifyContent: 'center',
     alignItems: 'center',
     flexWrap: 'wrap',
     marginBottom: 15,
   },
   react: {
     height: 40,
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'center',
     margin: 5,
     borderRadius: 6,
     borderWidth: 1,
     borderColor: 'rgb(240, 240, 240)',
   },
   selectedReact: {
     backgroundColor: 'rgb(172,203,238)',
     borderColor: 'rgb(172,203,238)',
   },
   reactNum: {
     marginLeft: 4,
     fontSize: 12,
     color: 'rgba(41,41,44,0.76)',
   },
})
