'use strict';

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {View, StyleSheet, TouchableOpacity} from 'react-native'
import QRCode from 'react-native-qrcode'
import Modal from 'react-native-modal'
import AppStyles from '../styles'
import OctIcon from "react-native-vector-icons/Octicons";

export default class QrModal extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    isVisible: PropTypes.bool,
  };

  static defaultProps = {
    screen: false
  };

  render () {
    return (
      <Modal isVisible={this.props.isVisible} style={{marginLeft: 40, width: 200, height: 200, borderRadius: 15, alignItems: 'center', justifyContent: 'center'}}>
        <View style={styles.modal}>
          <QRCode size={220} fgColor={'black'} bgColor={'white'} value={this.props.value || 'none'}/>
        </View>
        <TouchableOpacity onPress={this.props.modalControl} style={{width: 40, height: 40, marginTop: 10, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center'}}>
          <OctIcon name="x" size={30} color="rgba(255,255,255,0.5)"/>
        </TouchableOpacity>
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
