import React, { Component } from 'react';
import {
  AppRegistry,
  Clipboard,
  StyleSheet,
  Text,
  View,
  Keyboard,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
const Web3 = require('web3');
import Toast from 'react-native-easy-toast';
const Contacts = require('react-native-contacts');
import * as Animatable from 'react-native-animatable';
import Drawer from 'react-native-drawer';
import Modal from 'react-native-modal';
import ActionButton from 'react-native-circular-action-menu';
import Icon from 'react-native-vector-icons/Ionicons';
import {transferEtherNoReward, transferTokensNoReward} from 'tenzorum'
import {checkSubdomainOwner, newSubdomain, loadAccount, addressResolver} from "../../utils/ensFunctions";

import DrawerView from './DrawerView';
import QrModal from '../components/QrModal';
import CameraModal from '../components/CameraModal';
import TxPopUp from './TxPopUp';
// import QRCode from './QRCode';
import EntypoIcon from 'react-native-vector-icons/Entypo'
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Input from '../components/Input'

import Camera from 'react-native-camera';
import FeatherIcon from 'react-native-vector-icons/Feather'
import Button from '../components/Button'

const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/rqmgop6P5BDFqz6yfGla'));
import {text, shadow} from "./themes";

let { height, width } = Dimensions.get('window');
import { navigate } from "../../utils/navigationWrapper";
import {ethSign, keccak} from "../util/native";
import { getPrivateKey, getPublicKey, loadAccounts } from "../util/db";
import EnsRegistry from "../components/EnsRegistry";
// const dat = ethSign("hello");
// console.log("LE KECCAK: ", dat);
const emptyAddress = '0x0000000000000000000000000000000000000000';
const currentAccount = "0x37386A1c592Ad2f1CafFdc929805aF78C71b1CE7";

// a19e5d901ff3c459899800b2f088220ff69c4e465e85e1e1fb84bc64d2921a01
// 0xF938BfDC53F72cB7a4B1946969bA0ccE05C902c6



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
    cameraModalVisible: false,
    qrModalVisible: false,
    ensDomain: '',
    ensAvailable: false,
    publicAddress: '',
    ensMessage: ''
  };


  componentDidMount() {

  }

  _sendEth = async () => {
    const payload = await transferTokensNoReward('0xDb0A1cf7EC068fd48A3f5869Bf4f60B62e4ECB5E', 10000000000, '0xa1b02d8c67b0fdcf4e379855868deb470e169cfb');
    // const payload = await transferEtherNoReward(1, '0x37386A1c592Ad2f1CafFdc929805aF78C71b1CE7');
    console.log('PAYLOAD: ', payload);
    const res = await fetch('https://tenz-tsn-js-ltvphcqvfo.now.sh/execute/0xf74694642a81a226771981cd38df9105a133c111', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    console.log('RESPONSE: ', res)
    return res
  };

  _resolveAddress = async (ensUsername) => {
    if (ensUsername.length === 0) {
      this.setState({ensAvailable: false, ensMessage: 'Enter a valid or unempty username'});
      return;
    }

    this.setState({ensDomain: ensUsername});
    const {ensDomain} = this.state;
    const addr = await addressResolver(ensUsername);

    if (addr === emptyAddress) {
      this.setState({ensAvailable: false, ensMessage: 'Invalid address'});
    } else if(addr === currentAccount) {
      this.setState({ensAvailable: true, ensMessage: "It's your domain!"});
    } else {
      this.setState({ensAvailable: true, ensMessage: "Valid address"});
    }

  };

  _toggleQrModal = () => {
    this.setState({qrModalVisible: !this.state.qrModalVisible})
  };

  render() {
    const { exchangeRate, qrModalVisible, cameraModalVisible, ensMessage, ensAvailable } = this.state;
    return (
      <TouchableWithoutFeedback>
        <View onPress={Keyboard.dismiss} style={{flex: 1}}>
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
            <View style={styles.header}>
              <Text style={text.heading}>Wallet</Text>
              <TouchableOpacity onPress={this._toggleQrModal}>
                <MaterialCommIcon name="qrcode-scan" size={20}/>
              </TouchableOpacity>
            </View>
            {/*<ScrollView style={{marginRight: -20, marginLeft: -20, height: 100, padding: 10, flex: 0}} horizontal showsHorizontalScrollIndicator={false}>*/}
              {/*<View style={styles.cryptoBox}/>*/}
              {/*<View style={styles.cryptoBox}/>*/}
              {/*<View style={styles.cryptoBox}/>*/}
              {/*<View style={styles.cryptoBox}/>*/}
              {/*<View style={styles.cryptoBox}/>*/}
            {/*</ScrollView>*/}
            <View style={styles.transactionBox}>
              <View style={styles.inputAndButton}>
                <Input placeholder="Send to..." onChangeText={this._resolveAddress} autoCapitalize="none"/>
                <TouchableOpacity onPress={() => this.setState({cameraModalVisible: !cameraModalVisible})} style={styles.squareButton}>
                  <MaterialCommIcon name="camera" color="rgba(0,0,0,0.5)" size={20}/>
                </TouchableOpacity>
              </View>
              <Text style={{marginTop: 10, height: 25, color: ensAvailable ? 'green' : 'red'}} numberOfLines={1}>
                {ensMessage}
              </Text>
              <View style={[styles.inputAndButton, {width: 170}]}>
                <Input placeholder="Amount" keyboardType={"numeric"}/>
                <TouchableOpacity style={styles.sendButton} onPress={this._sendEth}>
                  <Text style={text.lightMedium}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{flex:1, backgroundColor: '#f3f3f3', alignItems: 'flex-end'}}>
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
            </View>
            <CameraModal isVisible={cameraModalVisible} modalControl={() => this.setState({cameraModalVisible: !cameraModalVisible})}/>
            <QrModal value={'0x234423213423423413244231'} isVisible={qrModalVisible} modalControl={() => this.setState({qrModalVisible: !qrModalVisible})}/>
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
      </TouchableWithoutFeedback>
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
    padding: 20,
    backgroundColor: '#d3e4ee',
  },
  cryptoBox: {
    width: 80,
    height: 120,
    borderRadius: 15,
    backgroundColor: 'white',
    marginLeft: 10,
    ...shadow
  },
  header: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputAndButton: {
    flex:1,
    flexDirection: 'row',
    width: 210,
  },
  sendButton: {
    marginLeft: 10,
    borderRadius: 10,
    height: 40,
    width: 80,
    backgroundColor: '#a25cee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareButton: {
    marginLeft: 10,
    borderRadius: 10,
    height: 40,
    width: 40,
    backgroundColor: '#3f69ee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionBox: {
    width: width - 40,
    height: 200,
    padding: 10,
    borderRadius: 15,
    backgroundColor: 'white',
    ...shadow
  },
});
