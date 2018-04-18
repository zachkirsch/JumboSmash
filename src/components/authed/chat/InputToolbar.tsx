import React, { PureComponent } from 'react'
import { StyleSheet, TouchableOpacity, Platform } from 'react-native'
import {
  Composer,
  ComposerProps,
  InputToolbar,
  InputToolbarProps,
  SendProps,
} from 'react-native-gifted-chat'
import LinearGradient from 'react-native-linear-gradient'
import { JSText } from '../../common'

export default class extends PureComponent<InputToolbarProps, {}> {

  render() {
    return (
      <InputToolbar
        {...this.props}
        containerStyle={{borderTopWidth: 0}}
        renderComposer={this.renderComposer}
        renderSend={this.renderSend}
      />
    )
  }

  private renderComposer = (props: ComposerProps) => {

    // TODO: use our font for this text input
    return (
      <LinearGradient
        colors={['rgba(232, 240, 252, 0.35)', 'rgba(212, 214, 219, 0.35)']}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 1}}
        locations={[0, 1]}
        style={[styles.gradient, {height: props.composerHeight! + 4}]}
      >
        <Composer
          {...props}
          textInputStyle={{marginTop: 0, marginBottom: 0}}
          placeholder='Text to impress...'
        />
      </LinearGradient>
    )
  }

  private renderSend = (props: SendProps) => {

    const disabled = !props.text || !props.text.trim()

    return (
      <TouchableOpacity
        style={[styles.send, props.containerStyle]}
        onPress={this.onSend(props.text, props.onSend)}
        disabled={disabled}
      >
        <JSText style={[styles.sendText, props.textStyle, disabled && styles.disabled]}>
          Send
        </JSText>
      </TouchableOpacity>
    )
  }

  private onSend = (text: string | undefined, onSend?: ({ text }: { text: string }, b: boolean) => void) => () => {
    onSend && onSend({text: (text || '').trim()}, true)
  }

}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 2,
  },
  send: {
    justifyContent: 'center',
    marginHorizontal: 10,
    marginBottom: Platform.select({
      ios: 5,
      android: 12,
    }),
  },
  sendText: {
    color: 'blue',
    fontWeight: '600',
    fontSize: 17,
    backgroundColor: 'transparent',
  },
  disabled: {
    color: 'gray',
  },
})
