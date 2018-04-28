import React, { PureComponent } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import {
  Composer,
  ComposerProps,
  InputToolbar,
  InputToolbarProps,
  SendProps,
} from 'react-native-gifted-chat'
import LinearGradient from 'react-native-linear-gradient'
import { JSText } from '../../common'

type OnSend = ({ text }: { text: string }, shouldResetInputToolbar: boolean) => void

export default class extends PureComponent<InputToolbarProps, {}> {

  render() {
    return (
      <InputToolbar
        {...this.props}
        containerStyle={styles.inputToolbarContainer}
        renderComposer={this.renderComposer}
        renderSend={this.renderSend}
      />
    )
  }

  private renderComposer = (props: ComposerProps) => {

    const gradientStyle = [
      styles.gradient,
      {
        height: props.composerHeight! + 10,
      },
    ]

    return (
      <LinearGradient
        colors={['rgba(232, 240, 252, 0.35)', 'rgba(212, 214, 219, 0.35)']}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 1}}
        locations={[0, 1]}
        style={gradientStyle}
      >
        <Composer // TODO: use our font for this text input
          {...props}
          textInputStyle={styles.composer}
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

  private onSend = (text: string | undefined, onSend: OnSend | undefined) => () => {
    onSend && onSend({text: (text || '').trim()}, true)
  }

}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  send: {
    paddingHorizontal: 12,
    bottom: 0,
    right: 0,
    height: '90%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: {
    color: 'blue',
    fontWeight: '600',
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  disabled: {
    color: 'gray',
  },
  composer: {
    marginLeft: 13,
    marginRight: 50,
    marginBottom: 0,
  },
  inputToolbarContainer: {
    borderTopWidth: 0,
  },
})
