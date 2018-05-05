import React, { SFC } from 'react'
import { StyleSheet, View} from 'react-native'
import { JSText } from '../../common'
import { CREATORS } from '../../../globals'

/* tslint:disable-next-line:variable-name */
const CreditsSection: SFC<{}> = _ => {

  const getNamesAsString = (names: string[]) => names.join(', ')

  return (
    <View style={styles.container}>
      <JSText style={styles.text}>
        <JSText bold>Made with ❤️ by: </JSText>
        <JSText>{getNamesAsString(CREATORS.developers)}</JSText>
      </JSText>
      <JSText style={styles.text}>
        <JSText bold>App Design: </JSText>
        <JSText>{getNamesAsString(CREATORS.design)}</JSText>
      </JSText>
      <JSText style={styles.text}>
        <JSText bold>{'Logo & Icons: '}</JSText>
        <JSText>{getNamesAsString(CREATORS.logo_icons)}</JSText>
      </JSText>
    </View>
  )
}

export default CreditsSection

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
})
