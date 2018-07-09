import React, { Component } from 'react';
import {
  AlertIOS,
  AppRegistry,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableNativeFeedback,
  Vibration,
  View,
} from 'react-native';
const Web3 = require('web3');

import {text} from './themes';
import Input from './Input';
import ReactNativeHaptic from 'react-native-haptic';
import Modal from 'react-native-modal';
// import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import * as Animatable from 'react-native-animatable';

import { navigate } from "../../utils/navigationWrapper";

let {height, width} = Dimensions.get('window');

export default class TxPopUp extends Component {
  constructor() {
    super();
    this.state = {
      visibleModal: null,
      receiverAddress: '',
      amount: null,
    };
  }

  _cameraNavigate = (_this) => {
    ReactNativeHaptic.generate('selection');
    _this.setState({ visibleModal: null });
    navigate('ScanPublicKey', { data: { name: 'publicAddressRequest', _this: this }});
  };

  _transactionNavigate = (_this) => {
    ReactNativeHaptic.generate('selection');
    _this.setState({ visibleModal: null });
    navigate('WebView');
  };

  _renderButton = (text, onPress) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={{color: 'white'}}>{text}</Text>
    </TouchableOpacity>
  );

  _renderModalContent = (_this) => (
    <View style={styles.modalContent}>
      <View style={{flexDirection: 'column'}}>
        <View style={{flexDirection: 'row'}}>
          <Input
            onChange={(e) => this.setState({receiverAddress: e.target.value})}
            value={this.state.receiverAddress}
            placeholder='PUBLIC ADDRESS'
          />
          <TouchableOpacity
            onPress={() => this._cameraNavigate(_this)}
            style={{marginLeft: 10, backgroundColor: '#4EBBBA', height: 35, width: 35, borderRadius: 6, alignItems: 'center', justifyContent: 'center'}}
          >
            {/*<Image style={{resizeMode: 'contain', width: 20}}/>*/}
          </TouchableOpacity>
        </View>
        <Input
          onChange={(e) => this.setState({amount: parseInt(e.target.value)})}
          placeholder='AMOUNT'
          keyboardType='numeric'
        />
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => this._cameraNavigate(_this)}
            style={{ backgroundColor: '#4EBBBA', height: 35, width: 70, borderRadius: 6, alignItems: 'center', justifyContent: 'center'}}
          >
            <Text>SIGN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this._transactionNavigate(_this)}
            style={{marginLeft: 10, backgroundColor: '#C800B9', height: 35, width: 70, borderRadius: 6, alignItems: 'center', justifyContent: 'center'}}
          >
            <Text>SEND</Text>
          </TouchableOpacity>
        </View>
      </View>
      {this._renderButton("X", () => _this.setState({ visibleModal: null }))}
    </View>
  );

  render() {
    const {} = this.state;
    const {isVisible, _this} = this.props;
    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={() => _this.setState({ visibleModal: null })}
      >
        {this._renderModalContent(_this)}
      </Modal>
    )
  }
}


const styles = StyleSheet.create({
  accountBox: {
    padding: 10,
    width: width/2 - 20,
    height: width/2 - 70,
    backgroundColor: 'white',
    borderRadius: 6,
    marginBottom: 10,
    justifyContent: 'space-between'
  },
  accountBoxText: {
    fontFamily: 'DIN Condensed',
    color: 'grey',
    fontSize: 15,
  },
  button: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "transparent",
    flexDirection: 'row',
    padding: 22,
    justifyContent: "space-between",
    alignItems: "stretch",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "yellow"
  },
  modalInput: {
    fontFamily: 'DIN Condensed',
    backgroundColor: "transparent",
    height: 35,
    width: 200,
    padding: 5,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "yellow",
    color: 'white',
  },
  topNavText: {
    fontFamily: 'DIN Condensed',
    color: 'white',
    fontSize: 16,
  },
});