import React, { PureComponent } from 'react'
import { View, ScrollView, Image, StyleSheet, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native'

interface Props {
  imageUris: string[]
  enabled: boolean
}

interface State {
  carouselIndex: number
}

type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

class Carousel extends PureComponent<Props, State> {

  private carouselScrollView: any /* tslint:disable-line:no-any */

  constructor(props: Props) {
    super(props)
    this.state = {
      carouselIndex: 0,
    }
  }

  public reset = () => {
    this.setState({
      carouselIndex: 0,
    })
    this.carouselScrollView.scrollTo({ x: 0, y: 0, animated: true })
  }

  render() {
    return (
      <View>
      <ScrollView
        contentContainerStyle={styles.container}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={(ref) => this.carouselScrollView = ref}
        scrollEventThrottle={1}
        onScroll={this.onScroll}
        scrollEnabled={this.props.enabled}
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
      <Image
        key={i}
        source={{uri}}
        resizeMode={'cover'}
        style={styles.image}
      />
    ))
  }

  private renderDots = () => {
    if (!this.props.enabled) {
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
    const maxOffsetOfFirstPhoto = layoutMeasurement.width / 2
    const photoIndex = Math.floor(1 + (contentOffset.x - maxOffsetOfFirstPhoto) / layoutMeasurement.width)
    this.setState({
      carouselIndex: photoIndex,
    })
  }
}

export default Carousel

const styles = StyleSheet.create({
  container: {
    minHeight: HEIGHT * 0.6,
    minWidth: WIDTH * 3,
  },
  image: {
    flex: 1,
    height: undefined,
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
