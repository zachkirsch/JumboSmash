import React, { PureComponent } from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import Ionicons from 'react-native-vector-icons/Ionicons'
import JSText from './JSText'

interface Props {
  renderTitle?: () => JSX.Element
  title?: string
  renderRight?: () => JSX.Element
  onPressRight?: () => void
  renderLeft?: () => JSX.Element // if onPressLeft is defined, this defaults to a left chevron
  onPressLeft?: () => void
}

class HeaderBar extends PureComponent<Props, {}> {

  render() {
    const title = this.props.renderTitle
      ? this.props.renderTitle()
      : <JSText style={styles.title} bold>{this.props.title}</JSText>
    return (
      <SafeAreaView style={styles.container}>
        {this.renderLeftView()}
        <View style={styles.titleContainer}>
          {title}
        </View>
        {this.renderRightView()}
      </SafeAreaView>
    )
  }

  private onPress = (onPressProp: () => void) => () => onPressProp()

  private renderLeftView = () => {

    const leftView = this.props.renderLeft
      ? this.props.renderLeft()
      : this.props.onPressLeft && <Ionicons name='ios-arrow-back' size={30} color='rgb(172,203,238)' />

    const containerStyle = [styles.sideView, styles.leftView]

    if (this.props.onPressLeft) {
      return (
        <TouchableOpacity onPress={this.onPress(this.props.onPressLeft)} style={containerStyle}>
          {leftView}
        </TouchableOpacity>
      )
    }

    return (
      <View style={containerStyle}>
        {leftView}
      </View>
    )
  }

  private renderRightView = () => {

    const containerStyle = [styles.sideView, styles.rightView]

    if (!this.props.onPressRight || !this.props.renderRight) {
      return (
        <View style={containerStyle}>
          {this.props.renderRight && this.props.renderRight()}
        </View>
      )
    }
    return (
      <TouchableOpacity onPress={this.onPress(this.props.onPressRight)} style={containerStyle}>
        {this.props.renderRight()}
      </TouchableOpacity>
    )
  }
}

export default HeaderBar

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 66,
    zIndex: 20,
    ...Platform.select({
      ios: {
        shadowColor: 'lightgray',
        shadowRadius: 5,
        shadowOpacity: 1,
      },
    }),
    ...Platform.select({
      android: {
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
      },
    }),
  },
  sideView: {
    flex: 1,
    justifyContent: 'center',
  },
  leftView: {
    alignItems: 'flex-start',
    marginLeft: 10,
  },
  rightView: {
    alignItems: 'flex-end',
    marginRight: 10,
  },
  titleContainer: {
    flex: 1,
    flexGrow: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
  },
})
