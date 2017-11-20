import React, { PureComponent } from 'react'
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'

interface OwnProps {
  email: string
  onSubmitVerificationCode: (code: string) => void
  authErrorMessage?: string
}

type Props = OwnProps

interface State {
  verificationCode: string
}

const CODE_LENGTH = 6

class VerificationCodeScreen extends PureComponent<Props, State> {

  constructor (props: Props) {
    super(props)
    this.state = {
      verificationCode: '',
    }
  }

  public render() {

    return (
      <View style={[styles.container, styles.center]}>
      <View style={styles.centerText}>
          <Text>We just emailed {this.props.email} with the code 123456</Text>
          <Text style={styles.errorMessage}>
            {this.props.authErrorMessage}
          </Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder='Code'
          onChangeText={this.onChangeVerificationCode}
          value={this.state.verificationCode}
          keyboardType={'numeric'}
          maxLength={6}
          enablesReturnKeyAutomatically={true}
          onSubmitEditing={this.onSubmitVerificationCode}
          returnKeyType={'go'}
          autoFocus={true}
        />
        <Button
          onPress={this.onSubmitVerificationCode}
          title='Login'
          disabled={this.state.verificationCode.length !== CODE_LENGTH}
        />
      </View>
    )
  }

  private onChangeVerificationCode = (verificationCode: string) => {
    this.setState({
      verificationCode,
    })
  }

  private onSubmitVerificationCode = () => {
    this.props.onSubmitVerificationCode(this.state.verificationCode)
  }

}

export default VerificationCodeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  center: {
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 5,
    padding: 5,
  },
  centerText: {
    alignItems: 'center',
  },
  errorMessage: {
    color: 'red',
    fontWeight: 'bold',
  },
})
