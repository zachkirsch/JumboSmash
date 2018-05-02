import React, { PureComponent } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { JSText, JSImage } from '../../common'
import { ProfileReact } from '../../../services/profile'
import { User } from '../../../services/swipe'

interface Props {
  profile: User
  enabled: boolean
}

type StatefulProfileReact = ProfileReact & {
  originallyReacted: boolean
}

interface State {
  reacts: StatefulProfileReact[]
}

class ReactSection extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      reacts: this.props.profile.profileReacts.value.map(react => ({
        ...react,
        originallyReacted: !!react.reacted,
      })),
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.enabled) {
      this.setState({
        reacts: nextProps.profile.profileReacts.value.map(react => ({
          ...react,
          originallyReacted: !!react.reacted,
        })),
      })
    }
  }

  public reactsChanged() {
    return !!this.state.reacts.find(r => r.reacted !== r.originallyReacted)
  }

  public getReacts() {
    return this.state.reacts.filter(r => r.reacted)
  }

  public render() {

    const reactColumns = []
    for (let i = 0; i < this.state.reacts.length; i += 2) {
      reactColumns.push(
        <View style={styles.reactColumn} key={i}>
          {this.renderReact(this.state.reacts[i])}
          {this.renderReact(this.state.reacts[i + 1])}
        </View>
      )
    }

    return (
      <View style={styles.reacts}>
        {reactColumns}
      </View>
    )
  }

  private renderReact = (react: StatefulProfileReact | undefined) => {

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

    let reactCount = react.count
    if (react.reacted && !react.originallyReacted) {
      reactCount++
    } else if (!react.reacted && react.originallyReacted) {
      reactCount--
    }

    return (
      <TouchableOpacity
        style={[styles.react, react.reacted && styles.selectedReact]}
        onPress={this.toggleReact(react)}
      >
        {toRender}
        <JSText bold={react.reacted} style={styles.reactNum}>{` ${reactCount}`}</JSText>
      </TouchableOpacity>
    )
  }

  private toggleReact = (react: StatefulProfileReact) => () => {
    const reacts = this.state.reacts.map(r => {
      if (r.id === react.id) {
        return {
          ...react,
          reacted: !react.reacted,
        }
      }
      return r
    })
    this.setState({
      reacts,
    })
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
