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
import { getLightColor, getMainColor } from '../../../utils'
import { TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Entypo'

interface SeniorEvent {date: string, event: string, attending: boolean, attendees: string[]}
interface SeniorDateEvent {date: string, events: SeniorEvent[]}

interface State {
  checkedList: SeniorDateEvent[]
}

interface OwnProps {
  SeniorEventList: SeniorDateEvent[]
  newList: (list: SeniorDateEvent[]) => void
}

interface StateProps {

}
interface DispatchProps {
}

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>

class SeniorEventScreen extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      checkedList: this.props.navigation.state.params.SeniorEventList,
    }
  }

  render() {
    const SENIOREVENT = this.props.navigation.state.params.SeniorEventList
    return (
      <View style={styles.fill}>
        <HeaderBar title='My Senior Events' onPressLeft={this.props.navigation.goBack}/>
        <View style={[styles.topContainer, styles.topContainerWithRoomForStatusBar]}>
            <JSText style={styles.title}>
              Click below to RSVP, or to see who else is going!
            </JSText></View>
            <ScrollView>
              {this.renderDates(SENIOREVENT)}
            </ScrollView>
            </View>
    )
  }
  private renderDates = (dataList: SeniorDateEvent[]) => {
      return dataList.map((section, sectionIndex) => {
        return (
          <View key={sectionIndex}>
          <View style={styles.separator}/>
          <JSText style={styles.text}>{section.date}</JSText>
          <View style={styles.Titleseparator}/>
          {this.renderList(section.events, sectionIndex)}
          </View>
        )
      })
  }

  private renderList = (dataList: SeniorEvent[], index: number) => {
    const pressList = (ind: number, sectionIndex: number) => () => {this.toggleListItem(ind, sectionIndex)}
    return dataList.map((section, sectionIndex) => {
      return (
        <View  key={sectionIndex}>
      <View style={styles.container}>
      <CheckBox
        title={section.event}
        containerStyle={styles.bucketListContainer}
        onPress={pressList(index, sectionIndex)}
        checked={this.state.checkedList[index].events[sectionIndex].attending}
      />
        <View style={styles.subView}>
         <TouchableOpacity onPress={this.navigateTo('MyEventsScreen', {event: section.event, attendees: section.attendees})}>
         <Ionicons style={styles.title} name='chevron-right' size={30} color={getMainColor()} />
        </TouchableOpacity>
        </View>
        </View>

      </View>)
    })
  }

  private toggleListItem = (index: number, sectionIndex: number)  => {
    let newDay = {
      ...this.state.checkedList[index],
    }
    newDay.events[sectionIndex].attending = !newDay.events[sectionIndex].attending
    let newEventList = this.state.checkedList.slice()
    newEventList[index] = newDay
    this.setState({checkedList: newEventList}) // This works, uncertain as to why the frontend doesn't show up as checked...
    return this.props.navigation.state.params.newList(newEventList)

  }

  private navigateTo<T>(screen: string, props?: T) {
    return () => this.props.navigation.navigate(screen, props)
  }
}

export default SeniorEventScreen

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
  date: {
    fontSize: 13,
    paddingTop: 10,
    textDecorationColor: getLightColor(),
    flex: 1,
  },
  subView: {
    paddingTop: 10,
    flex: 1,
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
    flex: 4,
  },
  text: {
    fontSize: 16,
    padding: 10,
  },
  paddingBottom: {
    marginBottom: 10,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: 'black',
    marginTop: 20,
  },
  Titleseparator: {
    flex: 1,
    height: 1,
    backgroundColor: 'black',
    marginBottom: 5,
  },
   topContainerWithRoomForStatusBar: {
      paddingTop: 28,
    },
})
