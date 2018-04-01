import React, { PureComponent } from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import Ionicons from 'react-native-vector-icons/Ionicons'
import JSText from './JSText'

interface Props {
  renderTitle?: () => JSX.Element
  title?: string
  goBack: () => void
}

class HeaderBar extends PureComponent<Props, {}> {

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={this.goBack} style={styles.sideView}>
          <Ionicons name='ios-arrow-back' size={30} color='rgb(172,203,238)' />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          {this.props.renderTitle ? this.props.renderTitle() : <JSText bold fontSize={22}>{this.props.title}</JSText>}
        </View>
        <View style={styles.sideView} />
      </SafeAreaView>
    )
  }

  private goBack = () => this.props.goBack()
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
})
