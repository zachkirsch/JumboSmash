import React, { PureComponent } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { connect, Dispatch } from 'react-redux'
import { getServerTime } from './services/time'
import { RootState } from './redux'
import RehydratedApp from './RehydratedApp'
import { JSText, JSButton, JSImage } from './components/common'
import { LoadableValue } from './services/redux'
import { Images } from './assets'

enum FetchResult {
  loading,
  success,
  error,
}

interface StateProps {
  rehydrated: boolean
  isLoggedIn: boolean
  serverTime: LoadableValue<number | undefined>
}

interface DispatchProps {
  getServerTime: () => void
}

type Props = StateProps & DispatchProps

interface State {
  forceShowLoadingScreen: boolean
  serverTimeFetched: boolean
}

class App extends PureComponent<Props, State> {

  private loadingScreenTimers: number[] = []
  private showedRehydratedApp = false

  constructor(props: Props) {
    super(props)
    this.state = {
      forceShowLoadingScreen: true,
      serverTimeFetched: false,
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
    if (this.getServerTimeStatus(nextProps) === FetchResult.success) {
      this.setState({
        serverTimeFetched: true,
      })
    }
  }

  public render() {
    if (this.shouldShowRehydratedApp() && !this.state.forceShowLoadingScreen) {
      this.showedRehydratedApp = true
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
        <ActivityIndicator style={styles.activityIndicator}/>
        <JSText>
          Connecting to server...
        </JSText>
      </View>
    )
  }

  private renderErrorScreen = () => {
    return (
      <View style={styles.container}>
        <JSImage cache={false} source={Images.sad} style={styles.sadImage} />
        <JSText style={styles.errorMessage}>
          Couldn't connect to the server
        </JSText>
        <JSButton label='Retry' onPress={this.getServerTime}/>
      </View>
    )
  }

  private shouldShowRehydratedApp = () => {
    if (this.showedRehydratedApp) {
      return true
    }

    if (this.state.forceShowLoadingScreen) {
      return false
    }

    return this.props.rehydrated && this.state.serverTimeFetched
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

  private getServerTimeStatus = (props?: Props): FetchResult => {
    if (!props) {
      props = this.props
    }
    if (props.serverTime.errorMessage) {
      return FetchResult.error
    }
    if (props.serverTime.value !== undefined && !props.serverTime.loading) {
      return FetchResult.success
    }
    return FetchResult.loading
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
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
  activityIndicator: {
    marginBottom: 10,
  },
  errorMessage: {
    marginTop: 15,
    marginBottom: 30,
    fontSize: 15,
  },
  sadImage: {
    width: 75,
    height: 75,
  },
})
