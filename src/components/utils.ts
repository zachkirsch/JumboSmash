import { Linking } from 'react-native'

const JUMBOSMASH_EMAIL = 'help@jumbosmash.com'

export function emailSupport(subject: string) {
  Linking.openURL(`mailto://${JUMBOSMASH_EMAIL}?subject=${subject}`)
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
      options: optionsWithCancel.map((option) => option.title),
      cancelButtonIndex: options.length,
      destructiveButtonIndex: options.findIndex((option) => option.destructive),
    },
    callback: (buttonIndex: number) => {
      optionsWithCancel[buttonIndex].onPress && optionsWithCancel[buttonIndex].onPress()
    },
  }
}
