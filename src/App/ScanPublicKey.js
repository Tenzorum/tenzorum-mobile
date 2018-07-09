'use strict';
import _ from 'lodash';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  NavigatorIOS,
  TouchableOpacity,
  Linking,
  Dimensions,
  Platform,
  SafeAreaView,
  Image,
  View,
} from 'react-native';
import axios from 'axios';
import OneSignal from 'react-native-onesignal';

import {navigate, resetAction} from "../../utils/navigationWrapper";
import ReactNativeHaptic from 'react-native-haptic';
import TouchID from 'react-native-touch-id';

// import { decodeTransaction, getTxFields, toAddress, serialize, unserialize, ec, sign, fromPhrase } from '../../common';
import {color} from "./themes";

import Camera from 'react-native-camera';

const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/rqmgop6P5BDFqz6yfGla'));
// web3.setProvider(new web3.providers.HttpProvider('https://www.etherdevswamp.org/rtethrpc'));
const privKey = 'cf06f0b35515af10b5dfef470e3a1e743470bf9033d06f198b4e829cb2e7ef05';
const privateKey = Buffer.from('cf06f0b35515af10b5dfef470e3a1e743470bf9033d06f198b4e829cb2e7ef05', 'hex')

const Tx = require('ethereumjs-tx');


export default class ScanPublicKey extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      tabBarIcon: ({tintColor}) => <Text style={{color: 'white'}}>Scan QR</Text>,
      title: 'Tenzorum',
      headerTitleStyle : { color: 'white'},
      headerStyle:
        {
          position: 'absolute',
          backgroundColor: '#1D2533',
          zIndex: 100,
          top: 0,
          left: 0,
          right: 0,
          borderBottomWidth: 0,
          shadowOpacity: 0,
          shadowOffset: {
            height: 0,
          },
          shadowRadius: 0,
        },
    }
  };

  constructor(props) {
    super(props);
    this.camera = null;
    this.state = {
      balance: '',
      privKey: false,
      pubKey: false,
      mode: 'loading',
      transaction: null,
      result: null,
      signedTx: null,
      phoneUid: '',
      camera: {
        aspect: Camera.constants.Aspect.fill,
        captureTarget: Camera.constants.CaptureTarget.cameraRoll,
        orientation: Camera.constants.Orientation.auto,
      },
    };
  }

  componentWillMount() {
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onIds = (device) => {

    if(device.userId) {
      console.log('DEVICE ID', device.userId);
      this.setState({phoneUid: device.userId});
    }
  };

  _sendETH = async (addr, amount) => {
    if(addr && amount) {
      const nonce = await web3.eth.getTransactionCount('0x37386A1c592Ad2f1CafFdc929805aF78C71b1CE7');
      const data = '';
      // var send = web3.eth.sendTransaction({from:eth.coinbase,to:contract_address, value:web3.toWei(0.05, "ether")});
      const chainId = await web3.eth.net.getId();
      const rawTx = {
        nonce: nonce,
        from: '0x37386A1c592Ad2f1CafFdc929805aF78C71b1CE7',
        to: '0xd4a0d9531Bf28C26869C526b2cAd2F2eB77D3844',
        value: 100000000000000000,
        gasPrice: 20000000000,
        gasLimit: 3000000,
        data,
        chainId,
      };

      const tx = new Tx(rawTx);
      tx.sign(privateKey);

      const serializedTx = tx.serialize();

      web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('transactionHash', (txHash) => {
          console.log('TransactionHash:' , txHash);
          // this.setState({log: 'Pending Transaction', logColor: 'red', transactionHash: txHash})
        })
        .on('receipt', (rec) => {
          console.log('Receipt:' , rec);
          // this.setState({log: 'Transaction Complete', logColor: 'green', transactionHash: rec.transactionHash})
        })
    }
  };

  onOpened = (openResult) => {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
    if (openResult.notification.payload.additionalData.actionSelected === "sign") {
      console.log('PAYLOAD: ', openResult.notification.payload.additionalData.payload.payload)
      let {publicAddress, amount} = openResult.notification.payload.additionalData.payload.payload;
      console.log('ADDRESS FROM SIGN', publicAddress)
      console.log('AMOUNT FROM SIGN', amount)
      this._sendETH(publicAddress, amount)
    }
  }

  _signKey = async (msg, socketId) => {
    ReactNativeHaptic.generate('selection');
    const account = await web3.eth.accounts.privateKeyToAccount(privKey)
      .sign(msg);

    console.log('PHONE ID: ', this.state.phoneUid);
    axios.get(`https://backend-nrmzuwwswb.now.sh/login/${socketId}/${this.state.phoneUid}/${msg}/${account.signature}`)
      .then((res) => {
        console.log('RES: ', res)
      })

  };

  _saveKeys = () => {
    let {pubKey} = this.state;
    navigate('WalletMain', {pubKey});
  };

  _onBarcodeRead = (read) => {

    if (read) {
      const dataArray = read.data.split('.');
      // this._signKey(dataArray[0], dataArray[1]);
      TouchID.authenticate('verify user')
        .then(success => {
          // alert('signing');
          this._signKey(dataArray[0], dataArray[1]);
        })
        .catch(error => {
          console.log('ERROR: ', error);
        });
    }


  };

  render() {
    // const { name } = this.props.navigation.state.params.data;
    const name = 'hello';
    const {pubKey, privKey, balance} = this.state;
    privKey && pubKey ? this._saveKeys() : null;
    return (
      <Camera
        ref={(cam) => {
          this.camera = cam;
        }}
        style={styles.preview}
        aspect={this.state.camera.aspect}
        captureTarget={this.state.camera.captureTarget}
        defaultTouchToFocus
        mirrorImage={false}
        onBarCodeRead={_.debounce(this._onBarcodeRead, 2000, {
          'leading': true,
          'trailing': false
        })}
      >
          <View style={styles.rectangleContainer}>
              <View style={styles.rectangle}>
                  <View style={styles.innerRectangle} />
              </View>
          </View>
      </Camera>
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  topNavText: {
    fontFamily: 'DIN Condensed',
    color: 'white',
    fontSize: 16,
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  tickBoxActive: {
    width: 10,
    height: 10,
    backgroundColor: color.magenta,
    borderRadius: 2,
  },
  tickBoxInactive: {
    width: 10,
    height: 10,
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 2,
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  preview: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonTouchable: {
    padding: 16,
  },
  boxContent: {
    backgroundColor: "transparent",
    flexDirection: 'column',
    padding: 22,
    justifyContent: "space-between",
    alignItems: "stretch",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#00FFB5",
    marginBottom: 40
  },
  view: {
    backgroundColor: 'black'
  },
  rectangleContainer: {
    flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent'
  },
  rectangle: {
    borderWidth: 2,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      height: 250,
      width: 250,
      borderColor: '#ccc',
      backgroundColor: 'transparent'
  },
  innerRectangle: {
    height: 248,
      width: 248,
      borderWidth: 2,
      borderRadius: 25,
      borderColor: '#ddd',
      backgroundColor: 'transparent'
  }
});