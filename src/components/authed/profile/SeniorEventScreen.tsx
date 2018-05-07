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
import { getLightColor } from '../../../utils'
import { TouchableOpacity } from 'react-native'

interface SeniorEvent {date: string, event: string, attending: boolean, attendees: string[]}

interface State {
  checkedList: SeniorEvent[]
}

interface OwnProps {
  SeniorEventList: SeniorEvent[]
  newList: (list: SeniorEvent[]) => void
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
              {this.renderList(SENIOREVENT)}
            </ScrollView>
            </View>
    )
  }
  private renderList = (dataList: SeniorEvent[]) => {
    const pressList = (sectionIndex: number) => () => {this.toggleListItem(sectionIndex)}
    return dataList.map((section, sectionIndex) => {
      return (
        <View  key={sectionIndex}>
      <View style={styles.container}>
      <CheckBox
        title={section.event}
        containerStyle={styles.bucketListContainer}
        onPress={pressList(sectionIndex)}
        checked={this.state.checkedList[sectionIndex].attending}
      />
        <View style={styles.subView}>
        <JSText style={styles.date}>{section.date}</JSText>
         <TouchableOpacity onPress={this.navigateTo('MyEventsScreen', {event: section.event, attendees: section.attendees})}>
        <JSText style={styles.date}>Who else is going?</JSText>
        </TouchableOpacity>
        </View>
        </View>
        <View style={styles.separator}/>
      </View>)
    })
  }

  private toggleListItem = (index: number)  => {
    let newEventList = this.props.navigation.state.params.SeniorEventList
    newEventList[index].attending = !newEventList[index].attending
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
