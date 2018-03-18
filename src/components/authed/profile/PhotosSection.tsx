import React, { PureComponent } from 'react'
import { View, Image, StyleSheet, TouchableWithoutFeedback, Platform, Dimensions } from 'react-native'
import ImagePicker, { Image as ImagePickerImage } from 'react-native-image-crop-picker'
import { connectActionSheet, ActionSheetProps } from '@expo/react-native-action-sheet'
import { default as SimpleLineIcons } from 'react-native-vector-icons/SimpleLineIcons'
import { default as Feather } from 'react-native-vector-icons/Feather'
import { ActionSheetOption, generateActionSheetOptions, lastIndexOf } from '../../utils'

interface OwnProps {
  images: string[]
  updateImages: (images: string[]) => void
}

interface State {
  swapping: boolean
  swappingIndex: number
}

const WIDTH = Dimensions.get('window').width

type Props = ActionSheetProps<OwnProps>

@connectActionSheet
class PhotosSection extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      swapping: false,
      swappingIndex: -1,
    }
  }

  render() {
    return (
      <View style={styles.photosContainer}>
        <View style={styles.photosTopRowContainer}>
          {this.renderPhoto(0)}
          <View style={styles.smallPhotosTopRowContainer}>
            {this.renderPhoto(1)}
            {this.renderPhoto(2)}
          </View>
        </View>
        <View style={styles.photosBottomRowContainer}>
          {this.renderPhoto(3)}
          {this.renderPhoto(4)}
          {this.renderPhoto(5)}
        </View>
      </View>
    )
  }

  private renderPhoto = (index: number) => {

    let touchableDisabled = false
    let overlayIcon

    const swappingBigPhotoAndRenderingEmptyPhoto = (
      this.state.swapping
      && this.state.swappingIndex === 0
      && !this.props.images[index]
    )

    if (this.state.swapping) {

      const lastIndexOfNonemptyPhoto = lastIndexOf(this.props.images, (imageUri => !!imageUri))

      touchableDisabled = true
      if (this.props.images[index] || this.state.swappingIndex > 0 && index < lastIndexOfNonemptyPhoto) {
        touchableDisabled = false
        if (index !== this.state.swappingIndex) {
          overlayIcon = (
            <SimpleLineIcons
              style={{backgroundColor: 'transparent'}}
              name={'target'}
              size={40}
              color='rgba(172,203,238,0.6)'
            />
          )
        }
      }
    } else if (!this.props.images[index]) {
      let indexOfFirstEmpty = this.props.images.findIndex(imageUri => !imageUri)
      if (indexOfFirstEmpty === -1) {
        indexOfFirstEmpty = this.props.images.length
      }
      if (indexOfFirstEmpty === index) {
        overlayIcon = (
          <Feather
            style={{backgroundColor: 'transparent'}}
            name={'plus'}
            size={50}
            color='rgba(172,203,238,0.6)'
          />
        )
      } else {
        touchableDisabled = true
      }
    }

    let image
    if (this.props.images[index]) {
      image = (
        <Image
          source={{uri: this.props.images[index]}}
          resizeMode='cover'
          style={[
            styles.photo,
            index === 0 ? styles.bigPhoto : styles.smallPhoto,
            this.state.swapping && this.state.swappingIndex === index && styles.semiTransparent,
          ]}>
        </Image>
      )
    } else {
      image = (
        <View
          style={[
            {
              justifyContent: 'center',
              alignItems: 'center',
            },
            styles.photo,
            index === 0 ? styles.bigPhoto : styles.smallPhoto,
            styles.emptyPhoto,
            swappingBigPhotoAndRenderingEmptyPhoto && styles.semiTransparent,
          ]}
        >
        </View>
      )
    }

    return (
      <View style={styles.shadow}>
        {image}
        <TouchableWithoutFeedback disabled={touchableDisabled} onPress={() => this.onPressImage(index)}>
          <View style={styles.photoOverlay}>
            {overlayIcon}
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  private onPressImage(index: number) {

    if (this.state.swapping) {
      const newImages = Array.from(this.props.images)
      const temp = newImages[index]
      newImages[index] = newImages[this.state.swappingIndex]
      newImages[this.state.swappingIndex] = temp
      this.props.updateImages(newImages)
      this.setState({
        swapping: false,
      })
      return
    }

    const buttons: ActionSheetOption[] = []

    // CHOOSE PHOTO BUTTON
    buttons.push({
      title: this.props.images[index] ? 'Change Photo' : 'Choose Photo',
      onPress: () => ImagePicker.openPicker({
        width: 1000,
        height: 1000,
        cropping: true,
        mediaType: 'photo',
        cropperToolbarTitle: 'Move and Scale to Crop',
      }).then((image: ImagePickerImage) => {
        const newImages = Array.from(this.props.images)
        newImages[index] = image.path
        this.props.updateImages(newImages)
      }),
    })

    if (this.props.images[index]) {

      // SWAP POSITION BUTTON
      const numPhotosChosen = this.props.images.filter((image: string) => image).length
      if (index !== 0 || numPhotosChosen > 1) {
        buttons.push({
          title: 'Swap Position',
          onPress: () => {
            this.setState({
              swapping: true,
              swappingIndex: index,
            })
          },
        })
      }
      if (index !== 0) {

        // REMOVE PHOTO BUTTON
        buttons.push({
          title: 'Remove Photo',
          onPress: () => {
            const newImages = Array.from(this.props.images)
            newImages[index] = undefined
            this.props.updateImages(newImages)
          },
          destructive: true,
        })
      }
    }

    const {options, callback} = generateActionSheetOptions(buttons)
    this.props.showActionSheetWithOptions(options, callback)
  }
}

export default PhotosSection

const styles = StyleSheet.create({
  photosContainer: {
    flex: 1,
    height: WIDTH,
    padding: .05 * WIDTH,
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  photosTopRowContainer: {
    height: WIDTH * 7 / 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallPhotosTopRowContainer: {
    width: WIDTH * 4 / 15,
    justifyContent: 'space-between',
  },
  photosBottomRowContainer: {
    height: WIDTH * 4 / 15,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  photo: {
    borderRadius: 5,
  },
  shadow: {
    borderRadius: 5,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(172, 203, 238)',
        shadowOpacity: 0.75,
        shadowRadius: .02 * WIDTH,
        shadowOffset: {
          width: 0,
          height: 0,
        },
      },
    }),
    ...Platform.select({
      android: {
        elevation: 4,
      },
    }),
  },
  bigPhoto: {
    height: WIDTH * 7 / 12,
    width: WIDTH * 7 / 12,
  },
  smallPhoto: {
    height: WIDTH * 4 / 15,
    width: WIDTH * 4 / 15,
  },
  emptyPhoto: {
    backgroundColor: 'white',
  },
  semiTransparent: {
    opacity: 0.4,
  },
  photoOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
})
