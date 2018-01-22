import React, { PureComponent } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native'

const JUMBOSMASH_EMAIL = 'help@jumbosmash.com'

class EmailUsFooter extends PureComponent<{}, {}> {

  render() {
    return (
      <View style={styles.emailUsContainer}>
        <TouchableOpacity
          onPress={this.sendUsEmail}
        >
          <Text>
            <Text>
              {'Got a question? '}
            </Text>
            <Text style={styles.emailUsText}>
              {'Email us.'}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  private sendUsEmail = () => {
    const subject = 'I need help with JumboSmash'
    Linking.openURL(`mailto://${JUMBOSMASH_EMAIL}?subject=${subject}`)
  }

}

export default EmailUsFooter

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emailUsContainer: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailUsText: {
    textDecorationLine: 'underline',
  },
})
