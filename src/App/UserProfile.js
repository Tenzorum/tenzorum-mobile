import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/rqmgop6P5BDFqz6yfGla'));

import Toast from 'react-native-easy-toast';
const Contacts = require('react-native-contacts');
import Drawer from 'react-native-drawer';
import ActionButton from "react-native-circular-action-menu";
import LinearGradient from 'react-native-linear-gradient'
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import FeatherIcon from 'react-native-vector-icons/Feather'

let { height, width } = Dimensions.get('window');

import DrawerView from './DrawerView';
import { navigate } from "../../utils/navigationWrapper";
import { getPubKey } from "../util/db";
import EnsRegistry from "../components/EnsRegistry";
import CameraModal from '../components/CameraModal';
import TransactionModal from '../components/TransactionModal';
import QrModal from "../components/QrModal";
import MaterialCommIcon from "react-native-vector-icons/MaterialCommunityIcons";

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
    showEnsModal: true, //TODO: make false
    cameraModalVisible: false,
    transactionModalVisible: false,
    qrModalVisible: false,
  };

  componentDidMount() {
    this._init();
    Contacts.getAll((err, contacts) => {
      if (err) throw err;
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
  }

  _init = async () => {
    const pubKey =  await getPubKey()
    this.setState({publicAddress: pubKey})
    const { publicAddress } = this.state;

    web3.eth.getTransactionCount(pubKey)
      .then(txCount => this.setState({txCount}));
    web3.eth.getCoinbase((err, coinbase) => {
      const balance = web3.eth.getBalance(publicAddress, (err2, balance) => {
        console.log('balance ' + balance);
        this.setState({balance});
      });
    });
  }

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
    const { showEnsModal, cameraModalVisible, transactionModalVisible, qrModalVisible, publicAddress } = this.state;
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
          <LinearGradient
            start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 1.0}}
            colors={['#8785f0', '#5753b1']}
            style={styles.container}>
            <View style={{ width: width - 40, flexDirection: 'row', marginTop: 40, marginBottom: 10, alignItems: 'center', justifyContent: 'space-between'}}>
              <TouchableOpacity onPress={this.showEnsModal}>
                {/*<View style={styles.loginButton}>*/}
                <FontAwesomeIcon style={styles.loginLogo} name="user-circle" color="white" size={35}/>
                {/*</View>*/}
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', padding: 10}} onPress={this.showEnsModal}>
                <Text style={{ fontSize: 20, color: 'white',  }}>@ {this.state.username ? this.state.username : <Text style={{ fontSize: 20, color: 'white',}}>Set username</Text>}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({qrModalVisible: !qrModalVisible })}>
                <MaterialCommIcon name="qrcode-scan" size={25} color="white"/>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{width: width - 25, height: height + 20, flexDirection: 'column'}} showsVerticalScrollIndicator={false}>
              <View style={styles.messagesContainer}>
                <View style={styles.messageDescription}>
                  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <FontAwesomeIcon style={styles.loginLogo} name="user-circle" color="grey" size={35}/>
                  </View>
                  <View style={{flex: 4, margin: 10}}>
                    <View><Text style={{fontWeight: '900'}}>Mark Pereira</Text></View>
                    <View><Text style={{fontWeight: '600'}}>Tenzorum Dev</Text></View>
                    <View><Text>Is it time for rum yet?</Text></View>
                  </View>
                  <View style={{ borderBottomColor: '#777', borderBottomWidth: 2,}}/>
                </View>
                <View style={styles.messageDescription}>
                  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <FontAwesomeIcon style={styles.loginLogo} name="user-circle" color="grey" size={35}/>
                  </View>
                  <View style={{flex: 4, margin: 10}}>
                    <View><Text style={{fontWeight: '900'}}>Moritz Neto</Text></View>
                    <View><Text style={{fontWeight: '600'}}>Life Advice</Text></View>
                    <View><Text numberOfLines={1}>I don't think I'm going to shave for the rest of the year man</Text></View>
                  </View>
                  <View style={{ borderBottomColor: '#777', borderBottomWidth: 2,}}/>
                </View>
                <View style={styles.messageDescription}>
                  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <FontAwesomeIcon style={styles.loginLogo} name="user-circle" color="grey" size={35}/>
                  </View>
                  <View style={{flex: 4, margin: 10}}>
                    <View><Text style={{fontWeight: '900'}}>Daniel Bar</Text></View>
                    <View><Text style={{fontWeight: '600'}}>Buidl gang</Text></View>
                    <View><Text numberOfLines={1}>Tickets to Jamaica booked, TenzCon 2019 otw</Text></View>
                  </View>
                  <View style={{ borderBottomColor: '#777', borderBottomWidth: 2,}}/>
                </View>
              </View>
              <Image style={{width: width - 25, marginBottom: 3, marginTop: -40, resizeMode:'contain'}} source={require('../../public/wot-mock.png')}/>
              <Image style={{width: width - 40, marginBottom: 3, marginTop: -80, resizeMode:'contain'}} source={require('../../public/pdevices.png')}/>
              <View style={{height: 200, width, backgroundColor: 'transparent'}}/>
            </ScrollView>
          </LinearGradient>
            <ActionButton position="right" radius={80} buttonColor="white" buttonTextColor="black">
              <ActionButton.Item size={45} buttonColor='white' title="New Task" onPress={this.openControlPanel}>
                <FeatherIcon name="settings" style={styles.actionButtonIcon} />
              </ActionButton.Item>
              <ActionButton.Item size={45} buttonColor='white' title="Notifications" onPress={() => this.setState({transactionModalVisible: !transactionModalVisible})}>
                <SimpleLineIcon size={45} name="wallet" style={styles.actionButtonIcon}/>
              </ActionButton.Item>
              <ActionButton.Item size={45} buttonColor='white' title="All Tasks" onPress={() => navigate('ScanPublicKey')}>
                <FeatherIcon name="camera" style={styles.actionButtonIcon} />
              </ActionButton.Item>
            </ActionButton>
          <EnsRegistry onRegister={this._getENS} isVisible={showEnsModal} toggleFunction={this.showEnsModal}/>
          <CameraModal isVisible={cameraModalVisible} modalControl={() => this.setState({cameraModalVisible: !cameraModalVisible})}/>
          <TransactionModal isVisible={transactionModalVisible} modalControl={() => this.setState({transactionModalVisible: !transactionModalVisible})}/>
          <QrModal value={publicAddress} isVisible={qrModalVisible} modalControl={() => this.setState({qrModalVisible: !qrModalVisible})}/>
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
    color: '#333',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
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
    width: width - 25,
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
