import { ActionSheetOptions } from '@expo/react-native-action-sheet'
import React, { PureComponent } from 'react'
import { Alert, Dimensions, Platform, StyleSheet, TouchableWithoutFeedback, View, Image } from 'react-native'
import ImagePicker, { Image as ImagePickerImage } from 'react-native-image-crop-picker'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ImageUri } from '../../../services/profile'
import { LoadableValue } from '../../../services/redux'
import { CircleButton, JSImage, JSImageProps } from '../../common'
import { ActionSheetOption, generateActionSheetOptions, getMainColor, getLightColor } from '../../../utils'
import { Images } from '../../../assets'

interface Props {
  images: Array<LoadableValue<ImageUri>>
  swapImages: (index1: number, index2: number) => void
  updateImage: (index: number, imageUri: string, mime: string) => void
  saveRequired: () => void
  showActionSheetWithOptions: (options: ActionSheetOptions, onPress: (buttonIndex: number) => void) => void,
}

interface LocalImage {
  uri: string
  mime: string
}

const EMPTY_LOCAL_IMAGE = {
  uri: '',
  mime: '',
}

interface State {
  images: LocalImage[]
  swapping: boolean
  swappingIndex: number
}

interface ImageWithStatus {
  uri: string
  uploading: boolean
}

const EMPTY_IMAGE_WITH_STATUS = {
  uri: '',
  uploading: false,
}

const WIDTH = Dimensions.get('window').width

class PhotosSection extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = this.getInitialState()
  }

  collapseImages = (onComplete?: () => void) => {
    const numImages = this.state.images.length
    const newImages = this.state.images.filter(image => image.uri)
    for (let i = newImages.length; i < numImages; i++) {
      newImages.push(EMPTY_LOCAL_IMAGE)
    }
    this.setState({ images: newImages }, onComplete)
  }

  save = () => {
    this.collapseImages(() => {
      this.state.images.forEach((image, i) => this.props.updateImage(i, image.uri, image.mime))
    })
  }

  revert = () => {
    this.setState(this.getInitialState())
  }

  images = () => this.state.images.map(image => image.uri)

  getImageCount = () => this.state.images.filter(image => image.uri).length

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

    const allImages = this.getImages()
    const image = allImages[index] || EMPTY_IMAGE_WITH_STATUS

    let touchableDisabled = false
    let plusIcon
    let swapImage

    if (this.state.swapping) {
      if (index !== this.state.swappingIndex) {
        if (image.uri) {
          swapImage = (
            <Image
              source={Images.swap}
              style={styles.swapImage}
            />
          )
        } else {
          touchableDisabled = true
        }
      }
    } else if (!image.uri) {
      let indexOfFirstEmpty = allImages.findIndex((imageWithStatus) => !imageWithStatus.uri)
      if (indexOfFirstEmpty === -1) {
        indexOfFirstEmpty = allImages.length
      }
      if (indexOfFirstEmpty === index) {
        plusIcon = (
          <Feather
            style={styles.plusIcon}
            name={'plus'}
            size={50}
            color={getLightColor()}
          />
        )
      } else {
        touchableDisabled = true
      }
    }

    let imageToRender

    if (image.uri) {
      const imageStyles = [
        styles.photo,
        index === 0 ? styles.bigPhoto : styles.smallPhoto,
      ]
      if (this.state.swapping && this.state.swappingIndex === index) {
        imageStyles.push(styles.semiTransparent)
      }
      const imageProps: JSImageProps = {
        cache: true,
        source: {
          uri: image.uri,
        },
        resizeMode: 'cover',
        style: imageStyles,
        activityIndicatorSize: index === 0 ? 'large' : 'small',
      }
      if (image.uri.startsWith('http')) {
        imageToRender = <JSImage {...imageProps} cache />
      } else {
        imageToRender = <Image {...imageProps} />
      }
    } else {
      const imageStyles = [
        styles.photo,
        index === 0 ? styles.bigPhoto : styles.smallPhoto,
        styles.emptyPhoto,
      ]
      imageToRender = <View style={imageStyles} />
    }

    let cornerButton
    if (Platform.OS === 'ios' && image.uri) {
        if (image.uploading) {
          cornerButton = (
            <CircleButton
              type='icon'
              IconClass={Ionicons}
              iconName={'md-sync'}
              iconSize={13}
              iconColor='white'
              onPress={this.cancelUpload(index)}
              style={styles.cornerButton}
              rotate
            />
          )
        } else if (this.canDeleteImage(index, allImages)) {
          cornerButton = (
            <CircleButton
              type='icon'
              IconClass={Entypo}
              iconName={'cross'}
              iconSize={15}
              iconColor='white'
              onPress={this.deletePhoto(index, {})}
              style={styles.cornerButton}
            />
          )
        }
    }

    return (
      <View style={styles.imageContainer}>
        {imageToRender}
        <TouchableWithoutFeedback disabled={touchableDisabled} onPress={this.onPressImage(index)}>
          <View style={styles.photoOverlay}>
            {plusIcon}
          </View>
        </TouchableWithoutFeedback>
        {swapImage}
        {cornerButton}
      </View>
    )
  }

  private getImageByIndex = (index: number): ImageWithStatus => {
    let uri: string
    let uploading: boolean

    if (this.props.images[index] && this.props.images[index].errorMessage) {
      uri = this.props.images[index].value.uri
      uploading = false
    } else {
      uri = this.state.images[index] ? this.state.images[index].uri : ''
      uploading = !!uri && this.props.images[index] && this.props.images[index].loading
    }

    return {
      uri,
      uploading,
    }
  }

  private getImages = (): ImageWithStatus[] => {
    return this.state.images.map((_, index) => this.getImageByIndex(index))
  }

  private cancelUpload = (index: number, withConfirmation = true) => () => {
    const alertInfo = !withConfirmation ? undefined : {
      title: 'Cancel Upload',
      message: 'Are you sure you want to cancel the upload?',
    }
    this.deletePhoto(index, alertInfo)()
  }

  private deletePhoto = (index: number, withConfirmation?: {title?: string, message?: string}) => () => {

    const deleteIt = () => {
      // this.props.updateImage(index, '', '')
      this.props.saveRequired()
      const newImages = Array.from(this.state.images)
      newImages[index] = EMPTY_LOCAL_IMAGE
      this.setState({
        images: newImages,
      })
    }

    if (!withConfirmation) {
      deleteIt()
    } else {
      Alert.alert(
        withConfirmation.title || 'Delete Photo',
        withConfirmation.message || 'Are you sure you want to delete this photo?',
        [
          {text: 'No', style: 'cancel'},
          {text: 'Yes', onPress: deleteIt, style: 'destructive'},
        ]
      )
    }
  }

  private canDeleteImage = (index: number, allImages?: ImageWithStatus[]) => {
    const image = (allImages ? allImages[index] : this.getImageByIndex(index)) || EMPTY_IMAGE_WITH_STATUS
    return !this.state.swapping
    && !!image.uri
    && !image.uploading
    && (allImages || this.getImages()).filter((i) => i.uri && !i.uploading).length > 1
  }

  private canSwapImage = (index: number) => {
    return this.state.images[index]
      && this.state.images[index].uri
      && this.getImages().filter(image => image.uri).length > 1
  }

  private onPressImage = (index: number) => () => {

    if (this.state.swapping) {
      let newImages = this.state.images
      if (this.state.swappingIndex !== index) {
        this.props.saveRequired()
        newImages = []
        const imageListSize = Math.max(this.state.images.length, index + 1, this.state.swappingIndex + 1)
        for (let i = 0; i < imageListSize; i++) {
          let toPush = this.state.images[i]
          if (i === index) {
            toPush = this.state.images[this.state.swappingIndex]
          } else if (i === this.state.swappingIndex) {
            toPush = this.state.images[index]
          }
          newImages.push(toPush || EMPTY_LOCAL_IMAGE)
        }
      }
      this.setState({
        swapping: false,
        images: newImages,
      })
      return
    }

    const buttons: ActionSheetOption[] = []

    buttons.push({
      title: this.state.images[index] && this.state.images[index].uri ? 'Change Photo' : 'Choose Photo',
      onPress: () => ImagePicker.openPicker({
          width: 500,
          height: 500,
          cropping: true,
          mediaType: 'photo',
          cropperToolbarTitle: 'Move and Scale to Crop',
        }).then((image: ImagePickerImage) => {
          // this.props.updateImage(index, image.path, image.mime)
          this.props.saveRequired()
          const newImages = Array.from(this.state.images)
          newImages[index] = { uri: image.path, mime: image.mime }
          this.setState({
            images: newImages,
          })
        }).catch(_ => Alert.alert(
          '',
          "Please enable photo access for JumboSmash in your phone's settings"
        )),
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
        onPress: this.deletePhoto(index),
        destructive: true,
      })
    }

    if (this.getImageByIndex(index).uploading) {
      buttons.push({
        title: 'Cancel Upload',
        onPress: this.cancelUpload(index, false),
        destructive: true,
      })
    }

    const {options, callback} = generateActionSheetOptions(buttons)
    this.props.showActionSheetWithOptions(options, callback)
  }

  private getInitialState = () => ({
    images: this.props.images.map((image) => ({uri: image.value.uri, mime: ''})),
    swapping: false,
    swappingIndex: -1,
  })
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
  imageContainer: {
    borderRadius: 5,
    backgroundColor: 'white',
    overflow: 'visible',
    ...Platform.select({
      ios: {
        shadowColor: getLightColor(),
        shadowOpacity: 0.75,
        shadowRadius: .02 * WIDTH,
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
    justifyContent: 'center',
    alignItems: 'center',
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
  plusIcon: {
    backgroundColor: 'transparent',
  },
  cornerButton: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 0,
    marginBottom: 3,
    backgroundColor: getMainColor(),
    zIndex: 600,
    elevation: 600,
  },
  swapImage: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    height: 50,
    width: 50,
  },
})
