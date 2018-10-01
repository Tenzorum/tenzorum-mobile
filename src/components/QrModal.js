'use strict';

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Clipboard,
  View,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native'
import QRCode from 'react-native-qrcode'
import Modal from 'react-native-modal'
import AppStyles from '../styles'
import FeatherIcon from "react-native-vector-icons/Feather";

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
      <Modal isVisible={this.props.isVisible} style={{marginLeft: 90, width: 200, height: 200, borderRadius: 15, alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity onPress={() => Clipboard.setString(this.props.value)} style={styles.modal}>
          <QRCode size={220} fgColor={'white'} bgColor={'black'} value={this.props.value || 'none'} style={{margin: 10}}/>
          <Text style={{fontSize: 25, fontFamily: 'Menlo'}}>{this.props.value}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.modalControl} style={{width: 40, height: 40, marginTop: 10, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center'}}>
          <FeatherIcon name="x" size={25} color="white"/>
        </TouchableOpacity>
      </Modal>

    )
  }
}

const styles = StyleSheet.create({
  modal: {
    width: 250,
    height: 350,
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
