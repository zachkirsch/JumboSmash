import React, { SFC } from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { RectangleButton } from '../../common/index'

interface OwnProps {
  containerStyle?: ViewStyle
  buttonContainerStyle?: ViewStyle
  buttonStyle?: ViewStyle
  save: () => void
  revert: () => void
  disabled?: boolean
}

interface ButtonInfo {
  label: string
  onPress: () => void
  active?: boolean
}

/* tslint:disable-next-line:variable-name */
const SaveOrRevert: SFC<OwnProps> = props => {

  const renderButton = (button: ButtonInfo, index: number) => (
    <RectangleButton
      key={index}
      label={button.label}
      style={[props.buttonStyle]}
      containerStyle={props.buttonContainerStyle}
      onPress={button.onPress}
      active={button.active}
      disabled={props.disabled}
    />
  )

  const buttons: ButtonInfo[] = [
    {
      label: 'Cancel',
      onPress: props.revert,
    },
    {
      label: 'Save',
      onPress: props.save,
      active: true,
    },
  ]

  return (
    <View style={[styles.container, props.containerStyle]}>
      {buttons.map(renderButton)}
    </View>
  )
}

export default SaveOrRevert

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
})
