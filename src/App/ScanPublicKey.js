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
  TouchableWithoutFeedback,
  Image,
  View,
} from 'react-native';
import OneSignal from 'react-native-onesignal';
import EntypoIcon from 'react-native-vector-icons/Entypo'
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Input from './Input'

let { height, width } = Dimensions.get('window');

import {navigate, resetAction} from "../../utils/navigationWrapper";
import ReactNativeHaptic from 'react-native-haptic';
import TouchID from 'react-native-touch-id';

// import { decodeTransaction, getTxFields, toAddress, serialize, unserialize, ec, sign, fromPhrase } from '../../common';
import {color} from "./themes";

import Camera from 'react-native-camera';
import * as Animatable from "react-native-animatable";

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
      tabBarIcon: ({tintColor}) =>  <EntypoIcon size={35} name="emoji-happy" color="#1D2533"/>,
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

  componentDidMount() {
    fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('RESPONSE: ', responseJson);
        this.setState({exchangeRate: responseJson.USD})
      })
      .catch((error) => {
        console.error(error);
      });
    web3.eth.getTransactionCount('0x37386A1c592Ad2f1CafFdc929805aF78C71b1CE7')
      .then(txCount => this.setState({txCount}));
    web3.eth.getCoinbase((err, coinbase) => {
      const balance = web3.eth.getBalance('0x37386A1c592Ad2f1CafFdc929805aF78C71b1CE7', (err2, balance) => {
        console.log('balance ' + balance);
        this.setState({balance});
      });
    });
  }

  _sendETH = async (addr, amount) => {
    if(addr && amount) {
      const nonce = await web3.eth.getTransactionCount('0x37386A1c592Ad2f1CafFdc929805aF78C71b1CE7');
      const data = '';
      // var send = web3.eth.sendTransaction({from:eth.coinbase,to:contract_address, value:web3.toWei(0.05, "ether")});
      const chainId = await web3.eth.net.getId();
      const rawTx = {
        nonce: nonce,
        from: '0x37386A1c592Ad2f1CafFdc929805aF78C71b1CE7',
        to: '0xa1b02d8c67b0fdcf4e379855868deb470e169cfb',
        value: 100000000000000000,
        gasPrice: 20000000000,
        gasLimit: 3000000,
        data,
        chainId,
      };

      const tx = new Tx(rawTx);
      tx.sign(privateKey);

      const serializedTx = tx.serialize();

      fetch(`https://login.tenzorum.app/subscribe/${this.state.socketId}`)
        .then((res) => {
          console.log('RES: ', res)
        })

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
  };

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
          this.setState({socketId: dataArray[1]})
        })
        .catch(error => {
          console.log('ERROR: ', error);
        });
    }


  };
  handleViewRef = ref => this.view = ref;

  bounce = () => {

    if (this.state.showInput === false) {
      this.setState({showInput: !this.state.showInput});
      this.view.bounceInDown(1000).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));
    } else {
      this.view.bounceOutDown(1000).then(endState => console.log(endState.finished ? this.setState({showInput: !this.state.showInput}) : 'bounce cancelled'));
    }
  }


  render() {
    // const { name } = this.props.navigation.state.params.data;
    const name = 'hello';
    const {pubKey, privKey, balance, txCount, exchangeRate} = this.state;
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
          <View style={styles.container}>
            <View style={{ width: width - 40, flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'space-between'}}>
              <TouchableOpacity onPress={() => navigate('WalletMain')}>
                {/*<View style={styles.loginButton}>*/}
                  <FontAwesomeIcon style={styles.loginLogo} name="user-circle" color="white" size={35}/>
                {/*</View>*/}
              </TouchableOpacity>
              <Text style={styles.topNavText}>TENZORUM</Text>
              <TouchableOpacity style={{zIndex: 99999999999}} onPress={this.openControlPanel}>
                <EntypoIcon size={35} name="dots-three-vertical" color="#1D2533"/>
              </TouchableOpacity>
            </View>
            <View style={styles.lowerContainer}>
            </View>
            <View style={styles.buttonContainer}>
              <View style={{flex: 1, alignItems: 'flex-start'}}>
                <Text style={styles.bottomNavTextLarge}>{txCount}</Text>
                <Text style={styles.bottomNavTextSmall}>TX COUNT</Text>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={styles.bottomNavTextLarge}>${Math.round(parseInt(balance)/10e17 * parseInt(exchangeRate))}</Text>
                <Text style={styles.bottomNavTextSmall}>USD VALUE</Text>
              </View>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <Text style={styles.bottomNavTextLarge}>{(parseInt(balance)/10e17).toFixed(2)}</Text>
                <Text style={styles.bottomNavTextSmall}>ETHEREUM</Text>
              </View>
            </View>
          </View>
      </Camera>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  topNavText: {
    fontFamily: 'DIN Condensed',
    color: 'grey',
    fontSize: 16,
  },
  bottomNavTextLarge: {
    fontFamily: 'DIN Condensed',
    color: 'white',
    fontSize: 40,
    marginBottom: -10
  },
  bottomNavTextSmall: {
    fontFamily: 'DIN Condensed',
    color: 'grey',
    fontSize: 13,
    marginBottom: -5
  },
  balanceText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16
  },
  bottomNav: {
    flexDirection: 'column'
  },
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'rgba(255,255,255,0.4)',
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  innerRectangle: {
    height: 248,
    width: 248,
    borderWidth: 2,
    borderRadius: 25,
    borderColor: '#ddd',
    backgroundColor: 'transparent'
  },
  loginLogo: {
    shadowColor: '#333',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0
  },
  loginButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#6455ee',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#333',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0
  },
  lowerContainer: {
    width,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
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
});
