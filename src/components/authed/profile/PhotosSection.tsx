import React, { PureComponent } from 'react'
import { Alert, View, Image, StyleSheet, TouchableWithoutFeedback, Platform, Dimensions } from 'react-native'
import ImagePicker, { Image as ImagePickerImage } from 'react-native-image-crop-picker'
import { connectActionSheet, ActionSheetProps } from '@expo/react-native-action-sheet'
import Foundation from 'react-native-vector-icons/Foundation'
import Feather from 'react-native-vector-icons/Feather'
import Entypo from 'react-native-vector-icons/Entypo'
import { ActionSheetOption, generateActionSheetOptions } from '../../utils'
import { CircleButton } from '../../common'
import { LoadableValue } from '../../../services/redux'
import { ImageUri } from '../../../services/profile'

interface OwnProps {
  images: LoadableValue<ImageUri>[]
  swapImages: (index1: number, index2: number) => void
  updateImage: (index: number, imageUri: string, mime: string) => void,
}

interface State {
  images: string[]
  swapping: boolean
  swappingIndex: number
}

interface ImageWithStatus {
  uri: string
  uploading: boolean
}

const WIDTH = Dimensions.get('window').width

type Props = ActionSheetProps<OwnProps>

@connectActionSheet
class PhotosSection extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      images: props.images.map(image => image.value.uri),
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

    const allImages = this.getImages()
    const image = allImages[index] || {
      uri: '',
      uploading: false,
    }

    let touchableDisabled = false
    let overlayIcon

    if (this.state.swapping) {
      if (index === this.state.swappingIndex) {
        touchableDisabled = true
      } else {
        touchableDisabled = false
        overlayIcon = (
          <Foundation
            style={styles.overlayIcon}
            name={'target-two'}
            size={40}
            color='rgba(172,203,238,0.6)'
          />
        )
      }
    } else if (!image.uri) {
      let indexOfFirstEmpty = allImages.findIndex(imageWithStatus => !imageWithStatus.uri)
      if (indexOfFirstEmpty === -1) {
        indexOfFirstEmpty = allImages.length
      }
      if (indexOfFirstEmpty === index) {
        overlayIcon = (
          <Feather
            style={styles.overlayIcon}
            name={'plus'}
            size={50}
            color='rgba(172,203,238,0.6)'
          />
        )
      } else {
        touchableDisabled = true
      }
    }

    let imageToRender
    if (image.uri) {
      imageToRender = (
        <Image
          source={{uri: image.uri}}
          resizeMode='cover'
          style={[
            styles.photo,
            index === 0 ? styles.bigPhoto : styles.smallPhoto,
            this.state.swapping && this.state.swappingIndex === index && styles.semiTransparent,
          ]}>
        </Image>
      )
    } else {
      imageToRender = (
        <View
          style={[
            {
              justifyContent: 'center',
              alignItems: 'center',
            },
            styles.photo,
            index === 0 ? styles.bigPhoto : styles.smallPhoto,
            styles.emptyPhoto,
          ]}
        >
        </View>
      )
    }

    let cornerButton: JSX.Element
    if (Platform.OS === 'ios' && image.uri) {
      if (image.uploading) {
        cornerButton = (
          <CircleButton
            IconClass={Feather}
            iconName='upload'
            iconSize={10}
            iconColor='white'
            onPress={() => this.cancelUpload(index)}
            style={styles.cornerButton} />
        )
      } else if (this.canDeleteImage(index, allImages)) {
        cornerButton = (
          <CircleButton
            IconClass={Entypo}
            iconName='cross'
            iconSize={15}
            iconColor='white'
            onPress={() => this.deletePhoto(index, {})}
            style={styles.cornerButton} />
        )
      }
    }

    return (
      <View style={styles.shadow}>
        {imageToRender}
        <TouchableWithoutFeedback disabled={touchableDisabled} onPress={() => this.onPressImage(index)}>
          <View style={styles.photoOverlay}>
            {overlayIcon}
          </View>
        </TouchableWithoutFeedback>
        {cornerButton}
      </View>
    )
  }

  private getImageByIndex = (index: number): ImageWithStatus => {
    let uri: string
    let uploading: boolean

    if (this.props.images[index] && this.props.images[index].errorMessage) {
      uploading = false
      uri = this.props.images[index].value.uri
    } else {
      uri = this.state.images[index]
      uploading = uri && this.props.images[index] && this.props.images[index].loading
    }

    return {
      uri,
      uploading,
    }
  }

  private getImages = (): ImageWithStatus[] => {
    return this.state.images.map((_, index) => this.getImageByIndex(index))
  }

  private cancelUpload = (index: number, withConfirmation = true) => {
    const alertInfo = withConfirmation && {
      title: 'Cancel Upload',
      message: 'Are you sure you want to cancel the upload?',
    }
    this.deletePhoto(index, alertInfo)
  }

  private deletePhoto = (index: number, withConfirmation?: {title?: string, message?: string}) => {

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
    const image = allImages ? allImages[index] : this.getImageByIndex(index)
    return !this.state.swapping
    && !!image.uri
    && !image.uploading
    && (allImages || this.getImages()).filter(i => i.uri && !i.uploading).length > 1
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
        onPress: () => this.deletePhoto(index),
        destructive: true,
      })
    }

    if (this.getImageByIndex(index).uploading) {
      buttons.push({
        title: 'Cancel Upload',
        onPress: () => this.cancelUpload(index, false),
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
  overlayIcon: {
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
    borderColor: 'gray',
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#0F52BA',
    zIndex: 6,
  },
})
