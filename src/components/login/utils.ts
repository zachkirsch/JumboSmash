import { Linking } from 'react-native'

const JUMBOSMASH_EMAIL = 'help@jumbosmash.com'

export function emailSupport(subject: string) {
  Linking.openURL(`mailto://${JUMBOSMASH_EMAIL}?subject=${subject}`)
}
