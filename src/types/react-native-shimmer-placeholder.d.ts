declare module 'react-native-shimmer-placeholder' {
  import React, { Component } from 'react'
  import { Animated, ViewStyle } from 'react-native'

  interface Properties {
    visible?: boolean
    style?: ViewStyle
    width?: number | string
    height?: number | string
    duration?: number
    widthShimmer?: number
    reverse?: boolean
    autoRun?: boolean
    colorShimmer?: string
    backbackgroundColorBehindBorder?: string
  }

  export default class ShimmerPlaceHolder extends Component<Properties, {}> {

    public getAnimated?: () => Animated.CompositeAnimation

  }
}
