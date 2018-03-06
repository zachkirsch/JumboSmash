import React, { PureComponent } from 'react'
import { View, TouchableWithoutFeedback, ScrollView, Image, StyleSheet, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native'

interface Props {
  imageUris: string[]
  enabled: boolean
  onTapImage?: () => void
}

interface State {
  carouselIndex: number
}

type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>

const WIDTH = Dimensions.get('window').width

class Carousel extends PureComponent<Props, State> {

  private carouselScrollView: any /* tslint:disable-line:no-any */

  constructor(props: Props) {
    super(props)
    this.state = {
      carouselIndex: 0,
    }
  }

  public reset = (animated: boolean) => {
    this.setState({
      carouselIndex: 0,
    })
    this.carouselScrollView.scrollTo({ x: 0, y: 0, animated })
  }

  render() {

    const containerStyle = {
      minWidth: WIDTH * this.props.imageUris.length,
    }

    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={containerStyle}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          ref={(ref) => this.carouselScrollView = ref}
          scrollEventThrottle={1}
          onScroll={this.onScroll}
          scrollEnabled={this.props.enabled}
          bounces={false}
        >
          {this.renderImages()}
        </ScrollView>
        <View
          style={styles.dotsContainer}
        >
          {this.renderDots()}
        </View>
      </View>
    )
  }

  private renderImages = () => {
    return this.props.imageUris.map((uri, i) => (
      <TouchableWithoutFeedback onPress={this.props.enabled && this.props.onTapImage}>
        <Image
          key={i}
          source={{uri}}
          resizeMode={'cover'}
          style={styles.image}
        />
      </TouchableWithoutFeedback>
    ))
  }

  private renderDots = () => {
    if (!this.props.enabled || this.props.imageUris.length <= 1) {
      return undefined
    }
    return this.props.imageUris.map((_, i) => (
      <View
        key={i}
        style={[styles.dot, {
          backgroundColor: this.state.carouselIndex === i ? 'black' : 'white',
          borderColor:     this.state.carouselIndex === i ? 'white' : 'black',
        }]
      }/>
    ))
  }

  private onScroll = (event: ScrollEvent) => {
    const { layoutMeasurement, contentOffset } = event.nativeEvent
    let photoIndex = Math.round(contentOffset.x / layoutMeasurement.width)
    photoIndex = Math.min(this.props.imageUris.length, Math.max(photoIndex, 0))
    this.setState({
      carouselIndex: photoIndex,
    })
  }
}

export default Carousel

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'green',
  },
  image: {
    height: WIDTH,
    width: WIDTH,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    bottom: 0,
    marginBottom: 10,
    width: WIDTH,
  },
  dot: {
    borderWidth: 0.5,
    marginHorizontal: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
})
