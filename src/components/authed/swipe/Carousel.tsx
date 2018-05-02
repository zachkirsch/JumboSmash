import React, { PureComponent } from 'react'
import {
  Dimensions,
  Animated,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Platform,
  ScrollEvent,
} from 'react-native'
import { JSImage } from '../../common'
import { clamp } from '../../../utils'

interface Props {
  imageUris: string[]
  enabled: boolean
  onTapImage?: () => void
  containerStyle?: any /* tslint:disable-line:no-any */
  imageContainerStyle?: any /* tslint:disable-line:no-any */
  imageStyle?: any /* tslint:disable-line:no-any */
}

interface State {
  carouselIndex: number
}

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
    this.carouselScrollView && this.carouselScrollView.scrollTo({ x: 0, y: 0, animated })
  }

  render() {
    return (
      <Animated.View style={[styles.container, this.props.containerStyle]}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          ref={(ref) => this.carouselScrollView = ref}
          scrollEventThrottle={16}
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
      </Animated.View>
    )
  }

  private renderImages = () => {

    return this.props.imageUris.map((uri, i) => (
      <Animated.View key={i} style={this.props.imageContainerStyle}>
        <TouchableWithoutFeedback onPress={this.onTap}>
          <View style={StyleSheet.absoluteFill}>
            <JSImage
              cache
              source={{uri}}
              style={[styles.image, this.props.imageStyle]}
              resizeMode={'stretch'}
              activityIndicatorSize='large'
              containerStyle={StyleSheet.absoluteFill}
            />
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    ))
  }

  private renderDots = () => {
    if (!this.props.enabled || this.props.imageUris.length <= 1) {
      return null
    }

    return this.props.imageUris.map((_, i) => {
      const style = [styles.dot, {
        backgroundColor: this.state.carouselIndex === i ? 'gray' : 'white',
        borderColor:     this.state.carouselIndex === i ? 'white' : 'gray',
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
    let carouselIndex = Math.round(contentOffset.x / layoutMeasurement.width)
    carouselIndex = clamp(carouselIndex, 0, this.props.imageUris.length - 1)
    this.setState({
      carouselIndex,
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
    borderWidth: 0.5,
    marginHorizontal: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
})
