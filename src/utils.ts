import { Linking, Dimensions, Platform } from 'react-native'

const JUMBOSMASH_EMAIL = 'help@jumbosmash.com'

/* tslint:disable-next-line:max-line-length */
export const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export function isIphoneX() {
  const dimen = Dimensions.get('window')
  return Platform.OS === 'ios' && (dimen.height === 812 || dimen.width === 812)
}

export function emailSupport(subject: string) {
  Linking.openURL(`mailto://${JUMBOSMASH_EMAIL}?subject=${subject}`)
}

export function xor<T>(a: T, b: T): boolean {
  return !!a && !b || !a && !!b
}

export function shuffle<T>(array: T[]) {
  let j, x
  for (let i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    x = array[i]
    array[i] = array[j]
    array[j] = x
  }
  return array
}

export function clamp(value: number, min: number, max: number) {
  if (value > max) {
    return max
  } else if (value < min) {
    return min
  } else {
    return value
  }
}

// returns A mod B
export function mod(a: number, b: number) {
  return ((a % b) + b) % b
}

export function lastIndexOf<T>(array: T[], predicate: (item: T) => boolean) {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i])) {
      return i
    }
  }
  return -1
}

export function getFirstName(fullName: string) {
  if (fullName) {
    return fullName.split(' ')[0]
  } else {
    return 'JumboSmash User'
  }
}

/* Action Sheet */

export interface ActionSheetOption {
  title: string
  onPress?: () => void
  destructive?: boolean
}

/* tslint:disable-next-line:no-empty */
export function generateActionSheetOptions(options: ActionSheetOption[], onCancel = () => {}) {
  const cancelOption: ActionSheetOption = {
    title: 'Cancel',
    onPress: onCancel,
  }

  const optionsWithCancel = options.concat(cancelOption)

  return {
    options: {
      options: optionsWithCancel.map(option => option.title),
      cancelButtonIndex: options.length,
      destructiveButtonIndex: options.findIndex(option => !!option.destructive),
    },
    callback: (buttonIndex: number) => {
      const onPress = optionsWithCancel[buttonIndex].onPress
      onPress && onPress()
    },
  }
}
