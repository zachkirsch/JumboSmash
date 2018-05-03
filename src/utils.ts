import { Linking, Dimensions, Platform } from 'react-native'
import * as globals from './globals'
import { User } from './services/swipe'

/* tslint:disable-next-line:max-line-length */
export const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export function isIphoneX() {
  const dimen = Dimensions.get('window')
  return Platform.OS === 'ios' && (dimen.height === 812 || dimen.width === 812)
}

export function emailSupport(subject: string, body = '') {
  Linking.openURL(`mailto://${globals.JUMBOSMASH_EMAIL}?subject=${subject}&body=${body}`)
}

export function reportUser(user?: User) {
  const subject = 'Block User on JumboSmash'
  let body = 'I would like to report the following person: '
  if (user) {
    body += `${user.fullName} (${user.email})`
  }
  body += '\nI am reporting this user because: '
  emailSupport(subject, body)
}

export function sendFeedback() {
  emailSupport('JumboSmash Feedback')
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

export interface Coordinates {
  latitude: number
  longitude: number
}

/* tslint:disable:variable-name */
const haversineInMiles = (coord1: Coordinates, coord2: Coordinates) => {
  const toRadians = (degrees: number) => degrees * Math.PI / 180
  const R = 6371e3 // meters
  const φ1 = toRadians(coord1.latitude)
  const φ2 = toRadians(coord2.latitude)
  const Δφ = toRadians(coord2.latitude - coord1.latitude)
  const Δλ = toRadians(coord2.longitude - coord1.longitude)
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distanceInMeters = R * c
  return distanceInMeters / 1609.34
}
/* tslint:enable:variable-name */

export const nearTufts = (coord: Coordinates) => {
  return haversineInMiles(coord, globals.TUFTS_COORDINATES) < globals.RADIUS_FOR_UNDERCLASSMEN
}

export const isSenior = (classYear: number) => globals.SENIOR_CLASS_YEAR === classYear

export const getMainColor = (opacity: number = 1) => {
  return `rgba(${globals.MAIN_COLOR.r}, ${globals.MAIN_COLOR.g}, ${globals.MAIN_COLOR.b}, ${opacity})`
}

export const getLightColor = (opacity: number = 1) => {
  return `rgba(${globals.LIGHT_COLOR.r}, ${globals.LIGHT_COLOR.g}, ${globals.LIGHT_COLOR.b}, ${opacity})`
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
