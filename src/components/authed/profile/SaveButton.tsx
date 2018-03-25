import React, { PureComponent } from 'react'
import { Platform, Animated, StyleSheet } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { CircleButton } from '../../common'

interface Props {
  saveRequired: boolean
  saving: boolean
  saveFailed: boolean
  save: () => void
}

interface State {
  opacity: Animated.Value
}

const VISIBLE_OPACITY = 0.8

export default class SaveButton extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      opacity: new Animated.Value(props.saveRequired ? VISIBLE_OPACITY : 0),
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.saveRequired !== nextProps.saveRequired) {
      Animated.timing(this.state.opacity, {
        toValue: nextProps.saveRequired ? VISIBLE_OPACITY : 0,
        duration: 100,
      }).start()
    }
  }

  render() {

    const style = [styles.saveButton, {
      opacity: this.state.opacity,
    }]
    return (
      <CircleButton
        IconClass={FontAwesome}
        iconName='save'
        iconColor={'lightgray'}
        iconSize={20}
        style={style}
        onPress={this.props.save}
      />
    )
  }
}

const styles = StyleSheet.create({
  saveButton: {
    position: 'absolute',
    paddingBottom: 5,
    marginHorizontal: 0,
    height: 40,
    width: 40,
    top: 20,
    right: 20,
    borderRadius: 20,
    backgroundColor: '#0F52BA',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(172, 203, 238, 0.75)',
        shadowRadius: 10,
        shadowOpacity: 1,
      },
    }),
    ...Platform.select({
      android: {
        elevation: 5,
      },
    }),
  },
})
