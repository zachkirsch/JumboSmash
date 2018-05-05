import { ImageCacheManager } from 'react-native-cached-image'

const manager = ImageCacheManager()

interface ImageCacheServiceType {
  cacheImage: (url: string) => void
  uncacheImage: (url: string) => void
  clearCache: () => void
}

export const ImageCacheService: ImageCacheServiceType = { /* tslint:disable-line:variable-name */
  cacheImage: (url) => url && manager.downloadAndCacheUrl(url, {}),
  uncacheImage: (url) => url && manager.deleteUrl(url, {}),
  clearCache: () => manager.clearCache(),
}
