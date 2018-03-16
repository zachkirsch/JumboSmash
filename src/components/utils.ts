import { Linking } from 'react-native'

const JUMBOSMASH_EMAIL = 'help@jumbosmash.com'

export function emailSupport(subject: string) {
  Linking.openURL(`mailto://${JUMBOSMASH_EMAIL}?subject=${subject}`)
}

export function shuffleArray<T>(array: T[]) {
  let j, x
  for (let i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      x = array[i]
      array[i] = array[j]
      array[j] = x
  }
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

export interface ActionSheetOption {
  title: string
  onPress?: () => void
  destructive?: boolean
}

export function generateActionSheetOptions(options: ActionSheetOption[],
                                           onCancel = () => {}) { /* tslint:disable-line:no-empty */
  const cancelOption: ActionSheetOption = {
    title: 'Cancel',
    onPress: onCancel,
  }

  const optionsWithCancel = options.concat(cancelOption)

  return [
    {
      options: optionsWithCancel.map(option => option.title),
      cancelButtonIndex: options.length,
      destructiveButtonIndex: options.findIndex(option => option.destructive),
    },
    (buttonIndex: number) => optionsWithCancel[buttonIndex].onPress && optionsWithCancel[buttonIndex].onPress()
  ]
}
