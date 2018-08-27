'use strict';

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'
import Modal from "react-native-modal";
import Camera from "react-native-camera";
import AppStyles from '../styles'

export default class QrModal extends Component {
  static propTypes = {
    visible: PropTypes.bool,
  };

  static defaultProps = {
    screen: false
  };

  render () {
    return (
      <Modal style={{width: 200, height: 200, borderRadius: 15}} visible={this.props.visible}>
        <Camera style={{width: 200, height: 200, borderRadius: 15}}/>
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


