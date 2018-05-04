import { Coordinates } from './utils'

export const SENIOR_CLASS_YEAR = 18

export const TUFTS_COORDINATES: Coordinates = {
  latitude: 42.4074843,
  longitude: -71.1190232,
}

export const RADIUS_FOR_UNDERCLASSMEN = 20

export const JUMBOSMASH_EMAIL = 'help@jumbosmash.com'

export const MAIN_COLOR = {
  r: 148,
  g: 167,
  b: 219,
}

export const LIGHT_COLOR = {
  r: 201,
  g: 211,
  b: 236,
}

const LOCAL_SERVER = true
const LOCAL_SERVER_URL = 'http://130.64.142.18:5000'
const STAGING = false
const STAGING_SERVER_URL = 'https://jumbosmash2018-prod.herokuapp.com/'
const PROD_SERVER_URL = 'https://jumbosmash2018-prod.herokuapp.com/'

export const SERVER_URL = LOCAL_SERVER
  ? LOCAL_SERVER_URL
  : STAGING ? STAGING_SERVER_URL : PROD_SERVER_URL
