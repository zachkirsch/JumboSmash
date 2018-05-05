import React, { PureComponent } from 'react'
import { View, ViewStyle, ImageProperties } from 'react-native'
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

class JSImage extends PureComponent<Props, {}> {

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
    return (
      <CachedImage
        {...this.props}
        activityIndicatorProps={{size: this.props.activityIndicatorSize}}
      />
    )
  }
}

export default JSImage
