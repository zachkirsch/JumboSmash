import React, { PureComponent } from 'react'
import { StyleSheet, View, Platform } from 'react-native'
import moment from 'moment'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../../redux'
import { HeaderBar, JSText } from '../../common'
import { Event, updateEvents } from '../../../services/profile'
import Checklist, { Section } from './Checklist'

interface State {
  currentRSVPs: Event[]
}

interface OwnProps {
}

interface StateProps {
  events: Event[]
}

interface DispatchProps {
  updateEvents: (events: Event[]) => void
}

type Props = NavigationScreenPropsWithRedux<OwnProps, StateProps & DispatchProps>

class EventsScreen extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      currentRSVPs: this.props.events,
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
          sections={this.getEvents()}
          keyExtractor={this.extractIdFromEvent}
          labelExtractor={this.extractNameFromEvent}
          isChecked={this.goingToEvent}
          onPressCheckbox={this.toggleEvent}
          onPressRightChevron={this.openEventScreen}
          stickySectionHeadersEnabled={false}
        />
      </View>
    )
  }

  private renderHeaderBar = () => {
    return (
      <HeaderBar
        title='Senior Events'
        onPressLeft={this.props.navigation.goBack}
      />
    )
  }

  private renderTopContainer = () => {
    return (
      <View style={styles.topContainer}>
        <JSText style={styles.title}>
          RSVP to the events you're going to this week, or
          click on one see who else is going!
        </JSText>
      </View>
    )
  }

  private getEvents = () => {
    const eventsByDay: Section<Event>[] = []
    this.state.currentRSVPs.forEach(event => {
      const dayStr = moment(event.time).format('dddd, MMMM D')
      let eventDay = eventsByDay.find(day => day.title === dayStr)
      if (eventDay === undefined) {
        eventDay = {
          title: dayStr,
          data: [],
        }
        eventsByDay.push(eventDay)
      }
      eventDay.data.push(event)
    })
    return eventsByDay
  }

  private extractIdFromEvent = (event: Event) => event.id.toString(10)
  private extractNameFromEvent = (event: Event) => event.name
  private goingToEvent = (event: Event) => event.going

  private openEventScreen = (event: Event) => {
    this.props.navigation.navigate('EventScreen', { event })
  }

  private saveChanges = () => {
    if (this.saveRequired()) {
      this.props.updateEvents(this.state.currentRSVPs)
    }
  }

  private saveRequired = () => {
    return !!this.props.events.find((event, index) => event.going !== this.state.currentRSVPs[index].going)
  }

  private toggleEvent = (event: Event) => {
    this.setState({
      currentRSVPs: this.state.currentRSVPs.map((other) => {
        if (other.id !== event.id) {
          return other
        }
        return {
          ...other,
          going: !other.going,
        }
      }),
    })
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    events: state.profile.events.value,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    updateEvents: (events: Event[]) => dispatch(updateEvents(events)),
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
