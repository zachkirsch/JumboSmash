import React, { PureComponent } from 'react'
import { StyleSheet, Platform, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SafeAreaView from 'react-native-safe-area-view'
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
        {this.props.renderTitle ? this.props.renderTitle() : <JSText bold fontSize={22}>{this.props.title}</JSText>}
        <TouchableOpacity onPress={() => this.props.goBack()} style={styles.backButton}>
          <Ionicons name='ios-arrow-back' size={30} color='rgb(172,203,238)' />
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

}

export default HeaderBar

const styles = StyleSheet.create({
  container: {
    height: 66,
    zIndex: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  backButton: {
    position: 'absolute',
    top: Platform.select({
      ios: 36,
      android: 20,
    }),
    left: 15,
  },
})
