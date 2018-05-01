import React, { PureComponent } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { connect, Dispatch } from 'react-redux'
import { getServerTime } from './services/time'
import { RootState } from './redux'
import RehydratedApp from './RehydratedApp'
import { JSText, JSButton } from './components/common'
import { LoadableValue } from './services/redux'

enum FetchResult {
  loading,
  success,
  error,
}

interface StateProps {
  rehydrated: boolean
  serverTime: LoadableValue<number | undefined>
}

interface DispatchProps {
  getServerTime: () => void
}

type Props = StateProps & DispatchProps

interface State {
  forceShowLoadingScreen: boolean
  doneWithLoading: boolean
}

class App extends PureComponent<Props, State> {

  private loadingScreenTimers: number[] = []
  private doneWithLoading = false

  constructor(props: Props) {
    super(props)
    this.state = {
      forceShowLoadingScreen: true,
      doneWithLoading: false,
    }
  }

  componentDidMount() {
    if (this.props.rehydrated) {
      this.getServerTime()
    }
  }

  componentWillUnmount() {
    this.loadingScreenTimers.forEach(timer => clearTimeout(timer))
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.rehydrated && !this.props.rehydrated) {
      this.getServerTime()
    }
    if (this.shouldShowRehydratedApp(nextProps)) {
      this.setState({
        doneWithLoading: true,
      })
    }
  }

  public render() {
    if (this.shouldShowRehydratedApp()) {
      this.doneWithLoading = true
      return <RehydratedApp />
    } else if (this.state.forceShowLoadingScreen || this.getServerTimeStatus() !== FetchResult.error) {
      return this.renderLoadingScreen()
    } else {
      return this.renderErrorScreen()
    }
  }

  private renderLoadingScreen = () => {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={styles.topSpace}/>
        <JSText>
          Connecting to server...
        </JSText>
      </View>
    )
  }

  private renderErrorScreen = () => {
    return (
      <View style={styles.container}>
        <JSText style={styles.topSpace}>
          Could not connect to the server
        </JSText>
        <JSButton label='Retry' onPress={this.getServerTime}/>
      </View>
    )
  }

  private shouldShowRehydratedApp = (props?: Props) => {
    if (!props) {
      props = this.props
    }

    return this.doneWithLoading || (
      props.rehydrated
      && this.getServerTimeStatus() === FetchResult.success
      && !this.state.forceShowLoadingScreen
    )
  }

  private getServerTime = () => {
    this.setState({
      forceShowLoadingScreen: true,
    }, () => {
      this.props.getServerTime()
      this.loadingScreenTimers.push(setTimeout(() => {
        this.setState({
          forceShowLoadingScreen: false,
        })
      }, 1000))
    })
  }

  private getServerTimeStatus = (): FetchResult => {
    if (this.props.serverTime.errorMessage) {
      return FetchResult.error
    }
    if (this.props.serverTime.value !== undefined && !this.props.serverTime.loading) {
      return FetchResult.success
    }
    return FetchResult.loading
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    rehydrated: state.redux.rehydrated,
    serverTime: state.time.serverTime,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    getServerTime: () => dispatch(getServerTime()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSpace: {
    marginBottom: 10,
  },
})
