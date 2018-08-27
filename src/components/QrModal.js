'use strict';

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'
import QRCode from 'react-native-qrcode'
import Modal from 'react-native-modal'
import AppStyles from '../styles'

export default class QrModal extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    visible: PropTypes.bool,
  };

  static defaultProps = {
    screen: false
  };

  render () {
    return (
      <Modal visible={this.props.visible}>
        <View style={styles.modal}>
          <QRCode size={220} fgColor={'black'} bgColor={'white'} value={this.props.value || 'none'}/>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  modal: {
    width: 250,
    height: 250,
    borderRadius: 15,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  }
})
