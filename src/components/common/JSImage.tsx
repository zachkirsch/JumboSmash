import React, { PureComponent } from 'react'
import { View, ViewStyle, ActivityIndicator, StyleSheet, Animated, ImageProperties } from 'react-native'

interface Props extends ImageProperties {
  activityIndicatorSize?: 'small' | 'large'
  containerStyle?: ViewStyle
}

interface State {
  loaded: boolean
}

export type JSImageProps = Props

class JSImage extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      loaded: false,
    }
  }

  public render() {

    return (
      <View style={this.props.containerStyle}>
        <Animated.Image
          {...this.props}
          onLoadEnd={this.onLoad}
        />
        {this.renderIndicator()}
      </View>
    )
  }

  private renderIndicator = () => {
    if (this.state.loaded) {
      return null
    } else {
      return (
        <View style={[StyleSheet.absoluteFill, styles.loadingImage]}>
          <ActivityIndicator size={this.props.activityIndicatorSize} />
        </View>
      )
    }
  }

  private onLoad = () => this.setState({ loaded: true })
}

export default JSImage

const styles = StyleSheet.create({
  loadingImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
