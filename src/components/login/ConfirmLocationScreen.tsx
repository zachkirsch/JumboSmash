import React, { PureComponent } from 'react'
import { ActivityIndicator, Alert, StyleSheet, View, GeolocationReturnType, GeolocationError } from 'react-native'
import { NavigationScreenPropsWithRedux } from 'react-navigation'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../redux'
import { JSText, JSButton, JSImage } from '../common'
import { confirmNearTufts } from '../../services/auth'
import { nearTufts, getMainColor } from '../../utils'
import { Images } from '../../assets'

interface DispatchProps {
  confirmNearTufts: () => void
}

interface State {
  determiningLocation: boolean
}

type Props = NavigationScreenPropsWithRedux<{}, DispatchProps>

class ConfirmLocationScreen extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      determiningLocation: false,
    }
  }

  public render() {
    return (
      <View style={styles.container}>
        <JSImage cache={false} source={Images.location} resizeMode='contain' style={styles.locationImage} />
        <View>
          <JSText style={[styles.text, styles.largeMargin]}>
            JumboSmash is only open to non-seniors who are at Tufts. Are you at Tufts right now?
          </JSText>
          <View style={styles.buttons}>
            <View style={styles.buttonContainer}>
              <JSButton
                label='NO'
                onPress={this.goBack}
                style={styles.button}
                colors={['#C4C6C9']}
                textStyle={styles.buttonText}
              />
            </View>
            <View style={styles.buttonContainer}>
              <JSButton
                label='YES'
                onPress={this.onPressYes}
                style={styles.button}
                colors={[getMainColor()]}
                textStyle={styles.buttonText}
              />
            </View>
          </View>
        </View>
        {this.renderDeterminingLocationOverlay()}
      </View>
    )
  }

  private renderDeterminingLocationOverlay = () => {
      if (!this.state.determiningLocation) {
        return null
      }
      return (
        <View style={styles.overlay}>
          <ActivityIndicator
            size='large'
            animating
            color='white'
          />
        </View>
      )
    }

  private goBack = () => this.props.navigation.popToTop()

  private onPressYes = () => {
    this.setState({
      determiningLocation: true,
    }, () => {
      // so the loading screen shows for at least a second
      setTimeout(() => {
        navigator.geolocation.getCurrentPosition(
          success => this.onGpsComplete(() => this.onGpsLocated(success)),
          error => this.onGpsComplete(() => this.onGpsError(error)),
          {
            timeout: 5000,
          }
        )
      }, 1000)
    })
  }

  private onGpsComplete = (callback: () => void) => {
    this.setState({
      determiningLocation: false,
    }, callback)
  }

  private onGpsLocated = (success: GeolocationReturnType) => {
    if (nearTufts(success.coords)) {
      this.props.confirmNearTufts()
    } else {
      Alert.alert(
        'Sorry',
        "You aren't at Tufts right now.\nEnjoy your summer!",
        [
          { text: 'OK', onPress: this.goBack },
        ]
      )
    }
  }

  private onGpsError = (error: GeolocationError) => {
    let errorText = 'There was an issue determining your location. Please try again later'
    if (error.code === error.PERMISSION_DENIED) {
      errorText = "Please enabled location services in your phone's settings and try again"
    }
    Alert.alert('GPS Error', errorText)
  }

}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => {
  return {
    confirmNearTufts: () => dispatch(confirmNearTufts()),
  }
}

export default connect(undefined, mapDispatchToProps)(ConfirmLocationScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationImage: {
    height: 75,
    width: 75,
  },
  text: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 15,
  },
  largeMargin: {
    paddingHorizontal: 10,
    paddingVertical: 30,
  },
  buttons: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  button: {
    paddingHorizontal: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
})
