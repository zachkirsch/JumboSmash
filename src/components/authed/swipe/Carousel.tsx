import React, { PureComponent } from 'react'
import {
  Dimensions,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Platform,
} from 'react-native'

interface Props {
  imageUris: string[]
  enabled: boolean
  onTapImage?: () => void
  imageContainerStyle: any /* tslint:disable-line:no-any */
}

interface State {
  carouselIndex: number
}

type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>

const WIDTH = Dimensions.get('window').width

class Carousel extends PureComponent<Props, State> {

  private carouselScrollView: any /* tslint:disable-line:no-any */
  private isScrolling: boolean = false

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
    return (
      <View style={styles.container}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          ref={(ref) => this.carouselScrollView = ref}
          scrollEventThrottle={1}
          onScroll={this.onScroll}
          onTouchMove={this.onScrollBeginDrag}
          onTouchEnd={this.onScrollEndDrag}
          scrollEnabled={this.props.enabled}
        >
          {this.renderImages()}
        </ScrollView>
        <View style={styles.dotsContainer}>
          {this.renderDots()}
        </View>
      </View>
    )
  }

  private renderImages = () => {
    return this.props.imageUris.filter((imageUri) => imageUri).map((uri, i) => (
      <Animated.View key={i} style={this.props.imageContainerStyle}>
        <TouchableWithoutFeedback onPress={this.onTap}>
          <Animated.Image
            source={{uri}}
            style={[styles.image]}
            resizeMode={'stretch'}
          />
        </TouchableWithoutFeedback>
      </Animated.View>
    ))
  }

  private renderDots = () => {
    if (!this.props.enabled || this.props.imageUris.length <= 1) {
      return undefined
    }

    return this.props.imageUris.map((_, i) => {
      const style = [styles.dot, {
        backgroundColor: this.state.carouselIndex === i ? 'black' : 'white',
        borderColor:     this.state.carouselIndex === i ? 'white' : 'black',
      }]
      return <View key={`dot-${i}`} style={style} />
    })
  }

  private onTap = () => {
    if (!this.props.enabled || !this.props.onTapImage) {
      return
    }
    if (Platform.OS === 'android' && this.isScrolling) {
      return
    }
    this.props.onTapImage()
  }

  private onScrollBeginDrag = () => this.isScrolling = true
  private onScrollEndDrag = () => this.isScrolling = false

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
    backgroundColor: 'white',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
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
    borderWidth: 0,
    marginHorizontal: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
})
