import React, { PureComponent } from 'react'
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'
import { JSText } from '../common'
import { emailSupport } from '../../utils'

interface Props {
  emailSubject?: string
  label?: string
  containerStyle?: ViewStyle
}

class EmailUsFooter extends PureComponent<Props, {}> {

  public render() {
    return (
      <View style={[styles.emailUsContainer, this.props.containerStyle]}>
        <TouchableOpacity onPress={this.sendUsEmail}>
          <JSText style={styles.emailUsText}>
            {this.props.label || 'Got a question? Email us.'}
          </JSText>
        </TouchableOpacity>
      </View>
    )
  }

  private sendUsEmail = () => {
    const subject = this.props.emailSubject || 'I need help with JumboSmash'
    emailSupport(subject)
  }
}

export default EmailUsFooter

const styles = StyleSheet.create({
  emailUsContainer: {
    marginBottom: 10,
  },
  emailUsText: {
    fontSize: 14,
    lineHeight: 14,
    padding: 10,
    textAlign: 'center',
  },
})
