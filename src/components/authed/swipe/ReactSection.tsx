import React, { PureComponent } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { JSText, JSImage } from '../../common'
import { ProfileReact } from '../../../services/profile'
import { User } from '../../../services/swipe'

interface Props {
  profile: User
  react: (reacts: ProfileReact[]) => void
  enabled: boolean
}

class ReactSection extends PureComponent<Props, {}> {

  public render() {

    const reactColumns = []
    for (let i = 0; i < this.props.profile.profileReacts.value.length; i += 2) {
      reactColumns.push(
        <View style={styles.reactColumn} key={i}>
          {this.renderReact(this.props.profile.profileReacts.value[i])}
          {this.renderReact(this.props.profile.profileReacts.value[i + 1])}
        </View>
      )
    }

    return (
      <View style={styles.reacts}>
        {reactColumns}
      </View>
    )
  }

  private renderReact = (react: ProfileReact | undefined) => {

    if (react === undefined) {
      return null
    }

    let toRender
    switch (react.type) {
      case 'emoji':
        toRender = <JSText style={styles.emoji}>{react.emoji}</JSText>
        break
      case 'image':
        toRender = (
          <JSImage
            source={{uri: react.imageUri}}
            style={styles.imageReact}
            resizeMode='contain'
            cache
          />
        )
    }
    return (
      <TouchableOpacity
        style={[styles.react, react.reacted && styles.selectedReact]}
        onPress={this.toggleReact(react)}
        disabled={!this.props.enabled}
      >
        {toRender}
        <JSText bold={react.reacted} style={styles.reactNum}>{` ${Math.round(Math.random() * 100)}`}</JSText>
      </TouchableOpacity>
    )
  }

  private toggleReact = (react: ProfileReact) => () => {
    this.props.react(this.props.profile.profileReacts.value.reduce((reacts, r) => {
      if (react.id !== r.id && r.reacted) {
        reacts.push(r)
      } else if (react.id === r.id && !r.reacted) {
        reacts.push(r)
      }
      return reacts
    }, [] as ProfileReact[]))
  }
}

export default ReactSection

const styles = StyleSheet.create({
  imageReact: {
    width: 25,
    height: 25,
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 23,
  },
  reactColumn: {
    height: 120,
    flex: 1,
    justifyContent: 'space-around',
    padding: 5,
  },
  reacts: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  react: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgb(240, 240, 240)',
  },
  selectedReact: {
    backgroundColor: 'rgb(172,203,238)',
    borderColor: 'rgb(172,203,238)',
  },
  reactNum: {
    marginLeft: 4,
    fontSize: 12,
    color: 'rgba(41,41,44,0.76)',
  },
})
