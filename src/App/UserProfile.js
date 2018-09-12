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

import {checkSubdomainOwner, newSubdomain, loadAccount} from "../../utils/ensFunctions";


import DrawerView from './DrawerView';
import TxPopUp from './TxPopUp';
// import QRCode from './QRCode';
import EntypoIcon from 'react-native-vector-icons/Entypo'
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Input from './Input'
import FeatherIcon from 'react-native-vector-icons/Feather'
import Button from '../components/Button'

const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/rqmgop6P5BDFqz6yfGla'));
import {text} from "./themes";

let { height, width } = Dimensions.get('window');
import { navigate } from "../../utils/navigationWrapper";
import { ethSign, words } from "../util/native";
import { getPrivateKey, getPublicKey, loadAccounts } from "../util/db";
import EnsRegistry from "../components/EnsRegistry";
import ActionButton from "react-native-circular-action-menu";
import Icon from "react-native-vector-icons/Ionicons";


type Props = {};
export default class UserProfile extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    return {
      tabBarIcon: ({tintColor}) => <FeatherIcon size={35} name="circle" color="#1D2533"/>,
      tabBarVisible: false,
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
    ensAvailable: false,
    username: false,
    showEnsModal: false
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

  // _getAccounts = async () => {
  //   const accounts = await loadAccounts();
  //   const account1 = accounts.length;
  //   console.log("address");
  //   console.log(account1);
  // }


  handleViewRef = ref => this.view = ref;

  showEnsModal  = () => this.setState({ showEnsModal: !this.state.showEnsModal });

  _getENS = (ensName) => {
    if (ensName.length !== 0) {
      // newSubdomain(ensName, 'tenz-id.eth', '0x37386A1c592Ad2f1CafFdc929805aF78C71b1CE7', '0x37386A1c592Ad2f1CafFdc929805aF78C71b1CE7');
      this.setState({username: ensName, showEnsModal: !this.state.showEnsModal});

    }
  };

  closeControlPanel = () => {
    this._drawer.close()
  };

  openControlPanel = () => {
    this._drawer.open()
  };

  render() {
    const { showEnsModal } = this.state;
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
              <TouchableOpacity onPress={() => navigate('WalletMain')}>
                {/*<View style={styles.loginButton}>*/}
                <FontAwesomeIcon style={styles.loginLogo} name="user-circle" color="white" size={35}/>
                {/*</View>*/}
              </TouchableOpacity>
              <TouchableOpacity style={{width, flexDirection: 'row', padding: 10}} onPress={this.showEnsModal}>
                <Text style={{ fontSize: 20, color: 'white',  }}>@ {this.state.username ? this.state.username : <Text style={{ fontSize: 20, color: '#999999',}}>Set username</Text>}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{zIndex: 99999999999}} onPress={this.openControlPanel}>
                <EntypoIcon size={35} name="dots-three-vertical" color="#1D2533"/>
              </TouchableOpacity>
            </View>
            <ScrollView style={{width: width - 20, flex: 1, flexDirection: 'column' }}>
              <View style={styles.messagesContainer}>
                <View style={styles.messageDescription}>
                  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <FontAwesomeIcon style={styles.loginLogo} name="user-circle" color="grey" size={35}/>
                  </View>
                  <View style={{flex: 3}}>
                    <View><Text>Mark Pereira</Text></View>
                    <View><Text>kjfnjssdfnjksdfjknsdjknsdfjknsdfjkn</Text></View>
                    <View><Text>sldnfsdlkfn</Text></View>
                  </View>
                  <View style={{ borderBottomColor: '#999', borderBottomWidth: 1, marginTop: 10}}/>
                </View>
                <View style={styles.messageDescription}>
                  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <FontAwesomeIcon style={styles.loginLogo} name="user-circle" color="grey" size={35}/>
                  </View>
                  <View style={{flex: 3}}>
                    <View><Text>Mark Pereira</Text></View>
                    <View><Text>kjfnjssdfnjksdfjknsdjknsdfjknsdfjkn</Text></View>
                    <View><Text>sldnfsdlkfn</Text></View>
                  </View>
                  <View style={{ borderBottomColor: '#999', borderBottomWidth: 1, marginTop: 10}}/>
                </View>
              </View>
              <Image style={{width: width - 40, marginBottom: 3, resizeMode:'contain'}} source={require('../../public/wot-mock.png')}/>
              <Image style={{width: width - 40, marginBottom: 3, resizeMode:'contain'}} source={require('../../public/pdevices.png')}/>
            </ScrollView>
          </View>
            {/*Rest of App come ABOVE the action button component!*/}
            <ActionButton position="right" radius={80} buttonColor="rgba(231,76,60,1)">
              <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => console.log("notes tapped!")}>
                <Icon name="ios-send" style={styles.actionButtonIcon} />
              </ActionButton.Item>
              <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {}}>
                <Icon name="ios-basketball" style={styles.actionButtonIcon} />
              </ActionButton.Item>
              <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => {}}>
                <Icon name="ios-browsers" style={styles.actionButtonIcon} />
              </ActionButton.Item>
            </ActionButton>
          <EnsRegistry onRegister={this._getENS} isVisible={showEnsModal} toggleFunction={this.showEnsModal}/>
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
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#482a63',
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
  messagesContainer: {
    width: width - 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  messageDescription: {
    flexDirection: 'row',
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
