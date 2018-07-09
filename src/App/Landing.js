import React, { Component } from 'react';
import {
  AppRegistry,
  Clipboard,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Toast from 'react-native-easy-toast';
import Drawer from 'react-native-drawer';

import DrawerView from './DrawerView';
import TxPopUp from './TxPopUp';

import {color} from "./themes";


let { height, width } = Dimensions.get('window');
import {navigate} from "../../utils/navigationWrapper";
import {_callFunction, init} from "../../utils/ether";

type Props = {};
export default class Main extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    return {
      tabBarVisible: false,
      headerVisible: false,
      headerStyle:
        {
          position: 'absolute',
          marginTop: -100,
          backgroundColor: 'transparent',
          zIndex: 100,
          top: 0,
          left: 0,
          right: 0,
          borderBottomWidth: 0,
        },
    }
  };

  state = {
    exchangeRate: 0,
    balance: null,
    account: 'alpha',
    visibleModal: null,
    publicAddress: '',
    txCount: 0
  };

  componentDidMount() {
    this._createWallet();
  }

  _createWallet = async () => {
    const wallet = await init();
    console.log('WALLET: ', wallet);
  };

  _joinGame = () => {
    navigate('HeadsOrTails', {data: 'JoinGame'});
  };
  _createGame = () => {
    _callFunction('createGame');
    navigate('HeadsOrTails', {data: 'QRCode'})
  };

  render() {
    const {account, balance, publicAddress, exchangeRate, txCount} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: color.blue, alignItems: 'center', justifyContent: 'space-around', padding: 50}}>
        {/*<Image style={{height: 200, resizeMode: 'contain'}} source={require('../../../public/ethereum_coin.png')} />*/}
        <Text style={{fontSize: 100, color: color.darkBlue, fontWeight: 'bold'}}>2UP!</Text>
        <TouchableOpacity onPress={this._joinGame} style={{ backgroundColor: color.darkBlue, borderRadius: 10, height: 50, width: 250, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 20, color: color.blue, fontWeight: 'bold'}}>Join Game</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._createGame} style={{ backgroundColor: color.darkBlue, borderRadius: 10, height: 50, width: 250, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 20, color: color.blue, fontWeight: 'bold'}}>Create Game</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
