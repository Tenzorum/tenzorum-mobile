'use strict';

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Modal from "react-native-modal";
import Camera from "react-native-camera";
import ReactNativeHaptic from 'react-native-haptic';
import AppStyles from '../styles'
import _ from "lodash";
import OneSignal from "react-native-onesignal";
import {navigate} from "../../utils/navigationWrapper";
import TouchID from "react-native-touch-id";
import OctIcon from 'react-native-vector-icons/Octicons';
import FeatherIcon from "react-native-vector-icons/Feather";
const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/rqmgop6P5BDFqz6yfGla'));
// web3.setProvider(new web3.providers.HttpProvider('https://www.etherdevswamp.org/rtethrpc'));
const privKey = 'cf06f0b35515af10b5dfef470e3a1e743470bf9033d06f198b4e829cb2e7ef05';
const privateKey = Buffer.from('cf06f0b35515af10b5dfef470e3a1e743470bf9033d06f198b4e829cb2e7ef05', 'hex')

const Tx = require('ethereumjs-tx');


export default class QrModal extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    modalControl: PropTypes.func
  };

  static defaultProps = {
    screen: false
  };

  constructor(props) {
    super(props);
    this.camera = null;
    this.state = {
      exchangeRate: 0,
      account: 'alpha',
      visibleModal: null,
      publicAddress: '',
      txCount: 0,
      balance: 0,
      privKey: false,
      pubKey: false,
      mode: 'loading',
      transaction: null,
      result: null,
      signedTx: null,
      phoneUid: '',
      showInput: false,
      socketId: '',
      camera: {
        aspect: Camera.constants.Aspect.fill,
        captureTarget: Camera.constants.CaptureTarget.cameraRoll,
        orientation: Camera.constants.Orientation.auto,
      },
    };
  }

  _signKey = async (msg, socketId) => {
    ReactNativeHaptic.generate('selection');
    const account = await web3.eth.accounts.privateKeyToAccount(privKey)
      .sign(msg);

    console.log('PHONE ID: ', this.state.phoneUid);
    fetch(`https://login.tenzorum.app/login/${socketId}/${this.state.phoneUid}/${msg}/${account.signature}`)
      .then((res) => {
        console.log('RES: ', res)
      })
  };

  _onBarcodeRead = (read) => {
    if (read) {
      console.log('READ PUBLIC ADDRESS', read.data)
      this.props.addressScan(read.data)
      this.props.modalControl();
      // const dataArray = read.data.split('.');
      // TouchID.authenticate('verify user')
      //   .then(success => {
      //     this._signKey(dataArray[0], dataArray[1]);
      //     this.setState({socketId: dataArray[1]})
      //   })
      //   .catch(error => {
      //     console.log('ERROR: ', error);
      //   });
    }
  };

  render () {
    return (
      <Modal style={{marginLeft: 90,width: 200, height: 200, borderRadius: 15, alignItems: 'center', justifyContent: 'center'}} isVisible={this.props.isVisible}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={{width: 200, height: 200, borderRadius: 15}}
          aspect={this.state.camera.aspect}
          captureTarget={this.state.camera.captureTarget}
          defaultTouchToFocus
          mirrorImage={false}
          onBarCodeRead={_.debounce(this._onBarcodeRead, 2000, {
            'leading': true,
            'trailing': false
          })}
        />
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


