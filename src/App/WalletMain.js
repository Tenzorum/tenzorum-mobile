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
  Platform, TouchableWithoutFeedback,
} from 'react-native';
const Web3 = require('web3');
import Toast from 'react-native-easy-toast';
const Contacts = require('react-native-contacts');
import * as Animatable from 'react-native-animatable';
// import QRCode from 'react-native-qrcode';
import Drawer from 'react-native-drawer';

import { init, checkSubdomainOwner, newSubdomain } from "../../utils/ensFunctions";
init();

import DrawerView from './DrawerView';
import TxPopUp from './TxPopUp';
// import QRCode from './QRCode';
import EntypoIcon from 'react-native-vector-icons/Entypo'
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Input from './Input'
import FeatherIcon from 'react-native-vector-icons/Feather'

// const privateKey = new Buffer('cf06f0b35515af10b5dfef470e3a1e743470bf9033d06f198b4e829cb2e7ef05', 'hex');

// const privateKeyString = 'cf06f0b35515af10b5dfef470e3a1e743470bf9033d06f198b4e829cb2e7ef05';

const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/rqmgop6P5BDFqz6yfGla'));
import {text} from "./themes";

let { height, width } = Dimensions.get('window');
import { navigate } from "../../utils/navigationWrapper";
import { ethSign } from "../util/native";


type Props = {};
export default class WalletMain extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    return {
      tabBarIcon: ({tintColor}) => <FeatherIcon size={35} name="circle" color="#1D2533"/>,
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
    balance: 0,
    account: 'alpha',
    visibleModal: null,
    publicAddress: '',
    txCount: 0,
    showInput: false,
    ensDomain: '',
    username: false
  };


  componentDidMount() {
    Contacts.getAll((err, contacts) => {
      if (err) throw err;

      // contacts returned
      console.log('LE CONTACTS', contacts)
    });

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

  handleViewRef = ref => this.view = ref;

  bounce = () => {
    const {ensDomain} = this.state;
    if (ensDomain.length !== 0) {
      newSubdomain(ensDomain, 'tenz-id.eth', '0x37386A1c592Ad2f1CafFdc929805aF78C71b1CE7', '0x37386A1c592Ad2f1CafFdc929805aF78C71b1CE7');
      this.setState({username: ensDomain})
    }

    if (this.state.showInput === false) {
      this.setState({showInput: !this.state.showInput});
      this.view.bounceInDown(1000).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));
    } else {
      this.view.bounceOutDown(1000).then(endState => console.log(endState.finished ? this.setState({showInput: !this.state.showInput}) : 'bounce cancelled'));
    }
  };

  _setENS = (e) => {
    const {ensDomain} = this.state;

    this.setState({ensDomain: e}, () => {
      checkSubdomainOwner(ensDomain, 'tenz-id.eth');
    })
  };

  closeControlPanel = () => {
    this._drawer.close()
  };

  openControlPanel = () => {
    this._drawer.open()
  };

  render() {
    const {account, balance, publicAddress, exchangeRate, txCount} = this.state;
    return (
      <View style={{flex: 1}}>
        <Drawer
          ref={(ref) => this._drawer = ref}
          type="overlay"
          content={<DrawerView close={this.closeControlPanel}/>}
          side="right"
          tapToClose={true}
          style={styles.drawerStyles}
          openDrawerOffset={width/2}
        >
          <View style={styles.container}>
            <View style={{ width: width - 40, flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'space-between'}}>
              <TouchableOpacity onPress={this._pressHandler}>
                {/*<Image style={{width: 22, height: 22, marginBottom: 3, resizeMode:'contain'}} source={require('../../../public/send_icon.png')} />*/}
              </TouchableOpacity>
              <Text style={styles.topNavText}>TENZORUM</Text>
              <TouchableOpacity style={{zIndex: 99999999999}} onPress={this.openControlPanel}>
                <EntypoIcon size={35} name="dots-three-vertical" color="white"/>
              </TouchableOpacity>
            </View>
            <View style={{width, flex: 1, flexDirection: 'column', padding: 20}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{width: 100, height: 100, alignItems: 'center', justifyContent: 'center'}}>
                  <FontAwesomeIcon style={styles.loginLogo} name="user-circle" color="white" size={80}/>
                </View>
                <View style={{flex: 1, height: 100, backgroundColor: 'transparent', borderRadius: 10, alignItems: 'flex-start', justifyContent: 'center'}}>
                  <View style={{height: 10, width: width - 280, backgroundColor: '#14aff8', borderRadius: 5}}/>
                  <View style={{height: 10, width: width - 230, backgroundColor: '#00f877', borderRadius: 5, marginTop: 20}}/>
                </View>
              </View>
              <View style={{ borderBottomColor: '#aaa', borderBottomWidth: 1, marginTop: 10}}/>
              <TouchableOpacity style={{width, flexDirection: 'row', padding: 10}} onPress={this.bounce}>
                <Text style={{ fontSize: 20, color: 'white',  }}>@ {this.state.username ? this.state.username : <Text style={{ fontSize: 20, color: '#999999',}}>Set username</Text>}</Text>
              </TouchableOpacity>
              <TouchableWithoutFeedback>
                <Animatable.View ref={this.handleViewRef}>
                  {this.state.showInput && <Input onChangeText={this._setENS} value={this.state.ensDomain} autoCapitalize="none"/>}
                </Animatable.View>
              </TouchableWithoutFeedback>
            </View>
            <View style={{width, flex: 1, flexDirection: 'column', padding: 20}}>
              <Image style={{width: width - 40, marginBottom: 3, resizeMode:'contain'}} source={require('../../public/wot-mock.png')}/>
              <Image style={{width: width - 40, marginBottom: 3, resizeMode:'contain'}} source={require('../../public/pdevices.png')}/>
            </View>
          </View>
        </Drawer>
        <Toast
          ref='toast'
          style={{backgroundColor:'black', borderRadius: 4, borderColor: 'yellow', borderWidth: 2 }}
          position='top'
          positionValue={150}
          fadeInDuration={50}
          fadeOutDuration={500}
          opacity={0.8}
          textStyle={{color:'white'}}
        />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#141414',
  },
  drawer: {
    backgroundColor: 'black',
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 3,
    zIndex: -9999,
  },
  balanceButton: {
    backgroundColor: '#0dab7f',
    padding: 10,
    width: 200,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
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
  linesAndLogo: {
    width: width - 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  modalContent: {
    backgroundColor: "transparent",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "yellow"
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0
  }
});
