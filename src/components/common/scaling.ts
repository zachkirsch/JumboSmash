import { Dimensions } from 'react-native'
const { width, height } = Dimensions.get('window')

// stolen from https://blog.solutotlv.com/size-matters/

const guidelineBaseWidth = 350
const guidelineBaseHeight = 680

const scale = (size: number) => width / guidelineBaseWidth * size
const verticalScale = (size: number) => height / guidelineBaseHeight * size
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor

export {scale, verticalScale, moderateScale}
export const DEFAULT_FONT_SIZE = 13
