import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native'

declare module 'react-native' {
  export type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>
}
