import React, { PureComponent } from 'react'
import { Alert, View, Image, StyleSheet, TouchableWithoutFeedback, Platform, Dimensions } from 'react-native'
import ImagePicker, { Image as ImagePickerImage } from 'react-native-image-crop-picker'
import { connectActionSheet, ActionSheetProps } from '@expo/react-native-action-sheet'
import { default as SimpleLineIcons } from 'react-native-vector-icons/SimpleLineIcons'
import { default as Feather } from 'react-native-vector-icons/Feather'
import { default as Entypo } from 'react-native-vector-icons/Entypo'
import { ActionSheetOption, generateActionSheetOptions } from '../../utils'
import { CircleButton } from '../../generic'

interface OwnProps {
  images: string[]
  swapImages: (index1: number, index2: number) => void
  updateImage: (index: number, imageUri: string, mime: string) => void,
}

interface State {
  images: string[]
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
      images: props.images,
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
      && !this.state.images[index]
    )

    if (this.state.swapping) {
      if (index === this.state.swappingIndex) {
        touchableDisabled = true
      } else {
        touchableDisabled = false
        overlayIcon = (
          <SimpleLineIcons
            style={{backgroundColor: 'transparent'}}
            name={'target'}
            size={40}
            color='rgba(172,203,238,0.6)'
          />
        )
      }
    } else if (!this.state.images[index]) {
      let indexOfFirstEmpty = this.state.images.findIndex(imageUri => !imageUri)
      if (indexOfFirstEmpty === -1) {
        indexOfFirstEmpty = this.state.images.length
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
    if (this.state.images[index]) {
      image = (
        <Image
          source={{uri: this.state.images[index]}}
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

    const deleteButton = this.canDeleteImage(index) && Platform.OS === 'ios' && ( // clipped on Android
      <CircleButton
        IconClass={Entypo}
        iconName='cross'
        iconSize={15}
        iconColor='white'
        onPress={() => this.deletePhoto(index, true)}
        style={styles.deleteButton} />
    )

    return (
      <View style={styles.shadow}>
        {image}
        <TouchableWithoutFeedback disabled={touchableDisabled} onPress={() => this.onPressImage(index)}>
          <View style={styles.photoOverlay}>
            {overlayIcon}
          </View>
        </TouchableWithoutFeedback>
        {deleteButton}
      </View>
    )
  }

  private deletePhoto = (index: number, withConfirmation: boolean) => {

    const deleteIt = () => {
      this.props.updateImage(index, '', '')
      const newImages = Array.from(this.state.images)
      newImages[index] = ''
      this.setState({
        images: newImages,
      })
    }

    if (!withConfirmation) {
      deleteIt()
    } else {
      Alert.alert(
        'Delete Photo',
        'Are you sure you want to delete this photo?',
        [
          {text: 'No', style: 'cancel'},
          {text: 'Yes', onPress: deleteIt, style: 'destructive'},
        ]
      )
    }
  }

  private canDeleteImage = (index: number) => {
    return !this.state.swapping
    && !!this.state.images[index]
    && this.state.images.filter((image: string) => image).length > 1
  }

  private canSwapImage = (index: number) => {
    return !!this.state.images[index]
  }

  private onPressImage = (index: number) => {

    if (this.state.swapping) {
      this.props.swapImages(index, this.state.swappingIndex)

      const newImages = []
      for (let i = 0; i < Math.max(this.state.images.length, index + 1, this.state.swappingIndex + 1); i++) {
        let toPush = this.state.images[i]
        if (i === index) {
          toPush = this.state.images[this.state.swappingIndex]
        } else if (i === this.state.swappingIndex) {
          toPush = this.state.images[index]
        }
        newImages.push(toPush || '')
      }

      this.setState({
        swapping: false,
        images: newImages,
      })
      return
    }

    const buttons: ActionSheetOption[] = []

    buttons.push({
      title: this.state.images[index] ? 'Change Photo' : 'Choose Photo',
      onPress: () => ImagePicker.openPicker({
        width: 2000,
        height: 2000,
        cropping: true,
        mediaType: 'photo',
        cropperToolbarTitle: 'Move and Scale to Crop',
      }).then((image: ImagePickerImage) => {
        this.props.updateImage(index, image.path, image.mime)
        const newImages = Array.from(this.state.images)
        newImages[index] = image.path
        this.setState({
          images: newImages,
        })
      }),
    })

    if (this.canSwapImage(index)) {
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

    if (this.canDeleteImage(index)) {
      buttons.push({
        title: 'Remove Photo',
        onPress: () => {
          this.deletePhoto(index, false)
        },
        destructive: true,
      })
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
    zIndex: 5,
  },
  deleteButton: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 0,
    marginBottom: 3,
    borderColor: 'gray',
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#0F52BA',
    zIndex: 6,
  },
})
