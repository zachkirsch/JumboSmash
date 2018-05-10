import React, { PureComponent } from 'react'
import {
  View,
  SectionList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { JSText } from '../../common'
import { getMainColor, getLightColor } from '../../../utils'

export interface Section<T> {
  title: string
  data: T[]
}

interface Props<ItemT> {
  sections: Section<ItemT>[]
  keyExtractor: (item: ItemT) => string
  labelExtractor: (item: ItemT) => string
  onPressCheckbox: (item: ItemT) => void
  isChecked: (item: ItemT) => void
  stickySectionHeadersEnabled?: boolean
  onPressRightChevron?: (item: ItemT) => void
}

class Checklist<ItemT> extends PureComponent<Props<ItemT>, {}> {

  render() {
    const stickySectionHeadersEnabled = this.props.stickySectionHeadersEnabled !== undefined
      ? this.props.stickySectionHeadersEnabled
      : true
    return (
      <SectionList
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSectionHeader}
        sections={this.props.sections}
        keyExtractor={this.props.keyExtractor}
        stickySectionHeadersEnabled={stickySectionHeadersEnabled}
        ItemSeparatorComponent={this.renderSeparator}
      />
    )
  }

  private renderSeparator = () => <View style={styles.separator} />

  private renderItem = ({item}: {item: ItemT}) => {
    return (
      <View style={styles.itemRow}>
        <TouchableOpacity onPress={this.onPressCheckbox(item)}>
          <MaterialCommunityIcons
            name={this.props.isChecked(item) ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
            style={styles.checkbox}
            size={35}
            color={getMainColor()}
          />
        </TouchableOpacity>
        {this.renderRightView(item)}
      </View>
    )
  }

  private renderRightView = (item: ItemT) => {
    if (!this.props.onPressRightChevron) {
      return (
        <View style={styles.itemTitleContainer}>
          <JSText style={styles.itemTitle}>{this.props.labelExtractor(item)}</JSText>
        </View>
      )
    }
    return (
      <TouchableOpacity style={styles.itemTitleContainer} onPress={this.onPressRightChevron(item)}>
        <JSText style={styles.itemTitle}>{this.props.labelExtractor(item)}</JSText>
        <MaterialCommunityIcons style={styles.chevronRight} name='chevron-right' size={30} color={getMainColor()} />
      </TouchableOpacity>
    )
  }

  private onPressRightChevron = (item: ItemT) => () => {
    this.props.onPressRightChevron && this.props.onPressRightChevron(item)
  }

  private onPressCheckbox = (item: ItemT) => () => {
    this.props.onPressCheckbox(item)
  }

  private renderSectionHeader = ({section}: {section: Section<ItemT>}) => {
    return <JSText bold style={styles.sectionTitle}>{section.title}</JSText>
  }
}

export default Checklist

const styles = StyleSheet.create({
  checkbox: {
    padding: 10,
  },
  sectionTitle: {
    width: '100%',
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 18,
    backgroundColor: 'rgb(241, 244, 250)',
    color: 'rgb(60, 60, 60)',
  },
  itemTitleContainer: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chevronRight: {
    paddingRight: 10,
  },
  itemTitle: {
    flex: 1,
    fontSize: 16,
  },
  itemRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: getLightColor(),
  },
})
