import React, { PureComponent } from 'react'
import { View, Image, ViewStyle, ImageProperties } from 'react-native'
import { CachedImage } from 'react-native-cached-image'
import { ImageCacheService } from '../../services/image-caching'

interface CacheProps {
  cache: true
  source: {
    uri: string
  }
}

interface NormalProps {
  cache: false
}

type Props = ImageProperties & (CacheProps | NormalProps) & {
  activityIndicatorSize?: 'small' | 'large'
  containerStyle?: ViewStyle
}

export type JSImageProps = Props

interface State {
  failed: boolean
}

class JSImage extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      failed: false,
    }
  }

  componentWillReceiveProps(props: Props) {
    if (props.cache) {
      ImageCacheService.cacheImage(props.source.uri)
    }
  }

  public render() {
    return (
      <View style={this.props.containerStyle}>
        {this.renderImage()}
      </View>
    )
  }

  private renderImage = () => {
    const { cache, ...otherProps } = this.props

    if (this.state.failed) {
      return (
        <Image {...otherProps} />
      )
    }

    return (
      <CachedImage
        {...otherProps}
        activityIndicatorProps={{size: this.props.activityIndicatorSize}}
        onError={this.onError}
      />
    )
  }

  private onError = () => {
    this.setState({
      failed: true,
    })
  }
}

export default JSImage
