import React, { PureComponent } from 'react'
import { Animated, Easing, PanResponder, View, StyleSheet, Image, ScrollView, TouchableWithoutFeedback, Dimensions } from 'react-native'
import Carousel from './Carousel'
import { JSText } from '../../generic'

interface Props {
  onExpandCard: () => void
  onCardFinishedExpanding: () => void
  onContractCard: () => void
}

interface State {
  containerMargin: Animated.Value
  borderRadius: Animated.Value
  bottomBorderRadius: Animated.Value
  topContainerFlex: Animated.Value
  tagsOpacity: Animated.Value
  bioOpacity: Animated.Value
  expanded: boolean
  nameColor: string
  scrollViewEnabled: boolean
}

const INITIAL_STATE = {
  containerMargin: 20,
  borderRadius: 20,
  bottomBorderRadius: 20,
  topContainerFlex: 2,
  tagsOpacity: 1,
  bioOpacity: 0,
  expanded: false,
  nameColor: 'blue',
  scrollViewEnabled: false,
}

const TAGS = [
  "Japanese",
  "jobless af",
  "Chinese",
  "did porn to pay for tuition",
  "has a lot of tags",
  "tags mcgee",
  "call me taggart",
  "is this tag good",
  "tag1",
  "tag2",
  "tag3",
  "Japanese",
  "jobless af",
  "Chinese",
  "did porn to pay for tuition",
  "has a lot of tags",
  "tags mcgee",
  "call me taggart",
  "is this tag good",
  "tag1",
  "tag2",
  "tag3",
]

const {width, height} = Dimensions.get('window')

export class CardContainer extends PureComponent<Props, State> {

  private scrollView: any
  private cardPanResponder: any
  private carousel: any

  constructor(props: Props) {
    super(props)
    this.state = this.getInitialState()
    this.cardPanResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        if (gestureState.dx === 0 && gestureState.dy === 0) {
          this.onTapCard()
          return false
        } else {
          this.setState({
            nameColor: 'pink',
          })
          return false
          return true
        }
      },
      onPanResponderMove: (event, gestureState) => {
        if (Math.abs(gestureState.dx) > 10) {
          return
        }
        if (this.state.expanded && gestureState.dy > 5) {
          //this.resetSize()
        }
        if (!this.state.expanded && gestureState.dy < 0) {
          //this.expandCard()
        }
      },
      onPanResponderRelease: (e, {vx, vy}) => {
        console.log('hi!')
      }
    })
  }

  public tapCard = () => {
    this.onTapCard()
  }

  public expandCard = () => {
    this.props.onExpandCard()
    this.setState({
      expanded: true,
      scrollViewEnabled: true,
    })
    this.state.tagsOpacity.setValue(0)
    this.state.bottomBorderRadius.setValue(0)
    Animated.timing(
      this.state.containerMargin,
      {
        toValue: 0,
        delay: 50,
        duration: 200,
      }
    ).start(this.props.onCardFinishedExpanding)
    Animated.timing(
      this.state.borderRadius,
      {
        toValue: 0,
        delay: 50,
        duration: 150,
      }
    ).start()
    Animated.timing(
      this.state.topContainerFlex,
      {
        toValue: 1.54,
        delay: 0,
        duration: 200,
      }
    ).start()
    Animated.timing(
      this.state.bioOpacity,
      {
        toValue: 1,
        delay: 200,
        duration: 250,
      }
    ).start()
    Animated.timing(
      this.state.tagsOpacity,
      {
        toValue: 1,
        delay: 200,
        duration: 250,
      }
    ).start()

  }

  public resetSize = () => {
    this.props.onContractCard()
    console.log(this.carousel)
    // this.carousel && this.carousel.getNode().scrollTo({x: 0, y: 0, animated: false})
    this.setState({
      expanded: false,
    })
    this.state.tagsOpacity.setValue(0)
    this.state.bioOpacity.setValue(0)
    Animated.timing(
      this.state.containerMargin,
      {
        toValue: INITIAL_STATE.containerMargin,
        delay: 0,
        duration: 175,
        easing: Easing.quad,
      }
    ).start()
    Animated.timing(
      this.state.borderRadius,
      {
        toValue: INITIAL_STATE.borderRadius,
        delay: 0,
        duration: 200,
      }
    ).start()
    Animated.timing(
      this.state.bottomBorderRadius,
      {
        toValue: INITIAL_STATE.borderRadius,
        delay: 0,
        duration: 200,
      }
    ).start()
    Animated.timing(
      this.state.topContainerFlex,
      {
        toValue: INITIAL_STATE.topContainerFlex,
        delay: 0,
        duration: 200,
      }
    ).start()
    Animated.timing(
      this.state.tagsOpacity,
      {
        toValue: 1,
        delay: 200,
        duration: 250,
      }
    ).start()
  }

  private justBeganDragFromTop = false
  private mainScrollView

  public render() {

    const animatedContainerStyle = {
      padding: this.state.containerMargin,
      borderRadius: this.state.borderRadius,
    }

      return (
        <Animated.View style={[styles.container, styles.scrollContainer, animatedContainerStyle]}>
        <ScrollView ref={(ref) => this.mainScrollView = ref} contentContainerStyle={styles.scrollContainer} style={[styles.container]} scrollEnabled={this.state.scrollViewEnabled}
        onScroll={(x) => {
        if (!this.state.expanded) {
          // this.mainScrollView && this.mainScrollView.getNode().scrollTo({x: 0, y: 0, animated: true})
          this.setState({
            //scrollViewEnabled: false,
          })
          return
        }
        if (this.justBeganDragFromTop) {
          console.log(this.state.scrollViewEnabled)
          console.log('here!')
          if (x.nativeEvent.contentOffset.y < -30) {
            this.resetSize()
            this.justBeganDragFromTop = false
          } else if (!this.state.expanded && x.nativeEvent.contentOffset.y > 5) {
            this.expandCard()
            this.justBeganDragFromTop = false
          }
        }}}
        onScrollBeginDrag={(x, y) => {
          console.log(x.nativeEvent)
          if (!this.state.expanded) {
            this.setState({
              scrollViewEnabled: false,
            })
          }
          if (x.nativeEvent.contentOffset.x === 0 && x.nativeEvent.contentOffset.y === 0) {
          this.justBeganDragFromTop = true
        } else {
          this.justBeganDragFromTop = false
        }}}
        onScrollEndDrag={() => {
          this.setState({
            scrollViewEnabled: false,
          })
          console.log(this.mainScrollView)
          if (!this.state.expanded) {
            this.mainScrollView && this.mainScrollView.getNode().scrollTo({x: 0, y: 0, animated: true})
            this.setState({
              scrollViewEnabled: false,
            })
          }
        }}
        scrollEventThrottle={1}>
          <View style={{flex: 1}}>
            {this.renderTop()}
            {this.renderBottom()}
          </View>
          </ScrollView>
        </Animated.View>
      )
  }

  private renderTop = () => {

    const animatedContainerStyle = {
      borderTopLeftRadius: this.state.borderRadius,
      borderTopRightRadius: this.state.borderRadius,
      //flex: this.state.topContainerFlex,
    }

/*

    return (
      <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={10}
          pagingEnabled
          contentContainerStyle={{flex:1}}
          scrollEnabled={this.state.expanded}
          {...this.cardPanResponder.panHandlers}
          ref={(ref) => this.carousel = ref}
        >

          <Animated.Image
            borderTopLeftRadius={this.state.borderRadius}
            borderTopRightRadius={this.state.borderRadius}
            source={require('../../../img/yuki.jpg')}
            resizeMode={'cover'}
            style={{flex: 1, width: undefined, height: undefined}}
          />

        </Animated.ScrollView>
    )

    return (
      <Animated.ScrollView horizontal pagingEnabled style={[animatedContainerStyle, {backgroundColor: 'red'}]} scrollEnabled={this.state.expanded} contentContainerStyle={styles.topContainer} {...this.cardPanResponder.panHandlers} showsHorizontalScrollIndicator={true} ref={(ref) => this.carousel = ref}>
      <TouchableWithoutFeedback style={{flex: 1}} onPress={this.onTapCard}>
        <Animated.Image
          borderTopLeftRadius={this.state.borderRadius}
          borderTopRightRadius={this.state.borderRadius} style={styles.profilePic}
          source={require('../../../img/yuki.jpg')}
          resizeMode={'cover'}
        />
        </TouchableWithoutFeedback>
      </Animated.ScrollView>
    )*/

    return (
        <Animated.View style={[styles.topContainer, animatedContainerStyle]} {...this.cardPanResponder.panHandlers}>
          <TouchableWithoutFeedback style={{flex: 1}} onPress={this.onTapCard}>
          <View style={styles.profilePicContainer}>
            <Carousel enabled={true || this.state.expanded}>
              <Animated.Image
                borderTopLeftRadius={this.state.borderRadius}
                borderTopRightRadius={this.state.borderRadius} style={styles.profilePic}
                source={require('../../../img/yuki.jpg')}
                resizeMode={'cover'}
              />
              <Animated.Image
                borderTopLeftRadius={this.state.borderRadius}
                borderTopRightRadius={this.state.borderRadius} style={styles.profilePic}
                source={require('../../../img/yuki.jpg')}
                resizeMode={'cover'}
              />
            </Carousel>
          </View>
          </TouchableWithoutFeedback>
      </Animated.View>
    )
  }

  private renderBottom = () => {

    const animatedContainerStyle = {
      borderBottomLeftRadius: this.state.bottomBorderRadius,
      borderBottomRightRadius: this.state.bottomBorderRadius,
    }

    const bioContainerStyle = {
      opacity: 1 // this.state.bioOpacity
    }

    const tagsContainerStyle = {
      opacity: 1 // this.state.tagsOpacity
    }

    const scrollView = (
      <View
        style={[styles.scrollView]}
      >
        <View>
          <JSText fontSize={20} bold style={[styles.name, {color: this.state.nameColor}]}>{this.state.expanded ? 'true' : 'false'}</JSText>
          <JSText fontSize={20} bold style={[styles.name, {color: this.state.nameColor}]}>{this.state.scrollViewEnabled ? 'true' : 'false'}</JSText>
        </View>
        <View>
          <Animated.View style={tagsContainerStyle}>
            <JSText>
              <JSText fontSize={17} style={styles.hash}>{"# "}</JSText>
              <JSText fontSize={14} style={styles.tags}>{TAGS.join(", ")}</JSText>
            </JSText>
          </Animated.View>
          <Animated.View style={bioContainerStyle}>
            <JSText style={styles.bio} fontSize={14}>This is my bio. It is very long. I am such a long writer. Look at me go! Soon I will have reached a few lines, and then BAM, I'm almost on line 5. Come on, you can do it. You've trained your whole life for this. Don't mess up now... yeah baby!! This is my bio. It is very long. I am such a long writer. Look at me go! Soon I will have reached a few lines, and then BAM, I'm almost on line 5. Come on, you can do it. You've trained your whole life for this. Don't mess up now... yeah baby!!</JSText>
          </Animated.View>
        </View>
      </View>
    ) || (

      <View
        style={[styles.scrollView]}
      >
        <View>
          <JSText fontSize={20} bold style={[styles.name, {color: this.state.nameColor}]}>Yuki</JSText>
        </View>
        <View>
          <Animated.View style={tagsContainerStyle}>
            <JSText>
              <JSText fontSize={17} style={styles.hash}>{"# "}</JSText>
              <JSText fontSize={14} style={styles.tags}>{TAGS.join(", ")}</JSText>
            </JSText>
          </Animated.View>
          <Animated.View style={bioContainerStyle}>
            <JSText style={styles.bio} fontSize={14}>This is my bio. It is very long. I am such a long writer. Look at me go! Soon I will have reached a few lines, and then BAM, I'm almost on line 5. Come on, you can do it. You've trained your whole life for this. Don't mess up now... yeah baby!! This is my bio. It is very long. I am such a long writer. Look at me go! Soon I will have reached a few lines, and then BAM, I'm almost on line 5. Come on, you can do it. You've trained your whole life for this. Don't mess up now... yeah baby!!</JSText>
          </Animated.View>
        </View>
      </View>
    )

    if (this.state.expanded) {
      return (
        <Animated.View style={[styles.bottomContainer, animatedContainerStyle]}>
        {scrollView}
        </Animated.View>
      )
    } else {
      return (
        <TouchableWithoutFeedback style={{flex: 1}} onPress={this.onTapCard}>
        <Animated.View style={[styles.bottomContainer, animatedContainerStyle]}>
        {scrollView}
        </Animated.View>
        </TouchableWithoutFeedback>
      )
    }
  }

  private getInitialState = (): State => {
    return {
      ...INITIAL_STATE,
      containerMargin: new Animated.Value(INITIAL_STATE.containerMargin),
      borderRadius: new Animated.Value(INITIAL_STATE.borderRadius),
      bottomBorderRadius: new Animated.Value(INITIAL_STATE.bottomBorderRadius),
      topContainerFlex: new Animated.Value(INITIAL_STATE.topContainerFlex),
      bioOpacity: new Animated.Value(INITIAL_STATE.bioOpacity),
      tagsOpacity: new Animated.Value(INITIAL_STATE.tagsOpacity),
    }
  }

  private onTapCard = () => {
    if (!this.state.expanded) {
      console.log('here')
      this.expandCard()
    } else {
      this.resetSize()
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    shadowColor: 'black',
    shadowRadius: 5,
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 0},
    elevation: 3,
    borderRadius: 20,
  },
  topContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'hidden',
    maxHeight: '100%',
  },
  profilePicContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: '100%',
    maxWidth: '100%',
  },
  profilePic: {
    maxWidth: width,
    maxHeight: height/2,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  scrollView: {
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  name: {
    color: 'rgb(66, 64, 64)',
    marginVertical: 10,
  },
  hash: {
    color: '#A8BAD8',
    marginRight: 3,
  },
  tags: {
  	color: '#9B9B9B',
  },
  bio: {
    marginTop: 15,
    marginBottom: 40,
    color: 'rgb(66, 64, 64)',
  },
})

export default CardContainer
