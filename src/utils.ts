import { Linking } from 'react-native'

const JUMBOSMASH_EMAIL = 'help@jumbosmash.com'

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

export function isAlphaNumeric(str: string) {
  if (str === '') {
    return true
  }

  for (let i = str.length - 1; i >= 0; i++) {
    const code = str.charCodeAt(i)
    if (code === undefined) {
      return false
    }
    if (!(code > 47 && code < 58) &&  // numeric (0-9)
        !(code > 64 && code < 91) &&  // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
      return false
    }
  }
  return true
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
