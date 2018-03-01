import React, { PureComponent } from 'react'
import { ScrollView } from 'react-native'

interface Props {
  enabled: boolean
  index: number
}

interface State {

}

class Carousel extends PureComponent<Props, State> {

  componentWillReceiveProps(newProps: Props) {
    if (newProps.index !== this.props.index) {

    }
  }

  render() {

    const children = React.Children.toArray(this.props.children)

    if (!this.props.enabled && false) {
      return children[0]
    } else {
      return (
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} scrollEnabled={this.props.enabled}
        onScroll={() => console.log('scroll')}>
          {this.props.children}
        </ScrollView>
      )
    }
  }

}

export default Carousel
