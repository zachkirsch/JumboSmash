import React, { PureComponent } from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import Ionicons from 'react-native-vector-icons/Ionicons'
import JSText from './JSText'

interface Props {
  renderTitle?: () => JSX.Element
  title?: string
  goBack: () => void
  renderRightIcon?: () => JSX.Element
  onPressRight?: () => void
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

  private goBack = () => this.props.goBack()

  private renderLeftView = () => {
    if (!this.props.goBack) {
      return <View style={styles.sideView} />
    }
    return (
      <TouchableOpacity onPress={this.goBack} style={styles.sideView}>
        <Ionicons name='ios-arrow-back' size={30} color='rgb(172,203,238)' />
      </TouchableOpacity>
    )
  }

  private renderRightView = () => {
    if (!this.props.onPressRight || !this.props.renderRightIcon) {
      return (
        <View style={styles.sideView}>
          {this.props.renderRightIcon && this.props.renderRightIcon()}
        </View>
      )
    }
    return (
      <TouchableOpacity onPress={this.props.onPressRight} style={styles.sideView}>
        {this.props.renderRightIcon()}
      </TouchableOpacity>
    )
  }
}

export default HeaderBar

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 66,
    zIndex: 20,
    ...Platform.select({
      ios: {
        shadowColor: 'gray',
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
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
  },
})
