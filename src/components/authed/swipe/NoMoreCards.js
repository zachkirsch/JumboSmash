'use strict';

import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';

export default class NoMoreCards extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text style={styles.noMoreCardsText}>No more cards</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  noMoreCardsText: {
    fontSize: 22,
  }
})
