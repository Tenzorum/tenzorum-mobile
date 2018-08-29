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
  TouchableWithoutFeedback,
} from 'react-native';
const Web3 = require('web3');
import Toast from 'react-native-easy-toast';
const Contacts = require('react-native-contacts');
import * as Animatable from 'react-native-animatable';
import Drawer from 'react-native-drawer';
import Modal from 'react-native-modal';

import {init, checkSubdomainOwner, newSubdomain, loadAccount} from "../../utils/ensFunctions";
init();

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
import { ethSign } from "../util/native";
import { getPrivateKey, getPublicKey, loadAccounts } from "../util/db";
import EnsRegistry from "../components/EnsRegistry";


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
  };


  componentDidMount() {

  }

  _toggleQrModal = () => {
    this.setState({qrModalVisible: !this.state.qrModalVisible})
  };

  render() {
    const { exchangeRate, qrModalVisible, cameraModalVisible } = this.state;
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
                <Input placeholder="Send to..."/>
                <TouchableOpacity onPress={() => this.setState({cameraModalVisible: !cameraModalVisible})} style={styles.squareButton}>
                  <MaterialCommIcon name="camera" color="rgba(0,0,0,0.5)" size={20}/>
                </TouchableOpacity>
              </View>
              <View style={[styles.inputAndButton, {width: 170}]}>
                <Input placeholder="Amount"/>
                <TouchableOpacity style={styles.sendButton}>
                  <Text style={text.lightMedium}>Send</Text>
                </TouchableOpacity>
              </View>
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
    )
  }
}


const styles = StyleSheet.create({
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
