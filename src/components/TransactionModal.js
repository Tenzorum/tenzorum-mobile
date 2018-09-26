import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  Clipboard,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

import Modal from 'react-native-modal';
import FeatherIcon from 'react-native-vector-icons/Feather'
import MaterialCommIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { RoundButton } from 'react-native-button-component';
import * as Animatable from 'react-native-animatable';

const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/rqmgop6P5BDFqz6yfGla'));

import Input from '../components/Input'
import {color} from "../../utils/themes";
import {addressResolver, checkSubdomainOwner, newSubdomain} from "../../utils/ensFunctions";

import QrModal from '../components/QrModal';
import CameraModal from '../components/CameraModal';
import {shadow, text} from "../App/themes";
import {navigate} from "../../utils/navigationWrapper";

const emptyAddress = '0x0000000000000000000000000000000000000000';

const publicAddress = "0x9E48c4A74D618a567CD657579B728774f35B82C5";

import { transferEtherNoReward, transferTokensNoReward, transferTokensWithTokenReward, transferEtherWithEtherReward } from 'tenzorum'
import {getPubKey} from "../util/db";
import {getBalance, getTenzBalance} from "../../utils/ether";


const cryptoCurrencies = [
  { name: 'Tenzorum', symbol: 'TENZ', abi: [], imageUrl: require('../../public/Tenz_logo.png'), type: "token", balance: 0, address: "0xB07C36074b8333B01e38A307df804FDc6c37e0eC", },
  { name: 'Ethereum', symbol: 'ETH', abi: [], imageUrl: require('../../public/ethereum_logo.png'), type: "cryptoCurrency", balance: '0', },
  { name: 'DAI', symbol: 'DAI', abi: [], imageUrl: require('../../public/dai_logo.png'), type: "token", balance: 52, },
  { name: 'FOAM', symbol: 'FOAM', abi: [], imageUrl: require('../../public/foam_logo.png'), type: "token", balance: 1000, },
  { name: 'Akropolis', symbol: 'AKR', abi: [], imageUrl: require('../../public/akropolis_logo.png'), type: "token", balance: 0, },
];

let {height, width} = Dimensions.get('window');

type Props = {};
export default class TransactionModal extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      buttonState: 'upload',
      cryptoBalance: '',
      ensDomain: '',
      ensAvailable: false,
      publicAddress: '',
      ensMessage: 'Enter a public address or ENS username',
      addressChecked: false,
      cameraModalVisible: false,
      qrModalVisible: false,
      currentCrypto: { name: 'Select Currency' },
      tenzBalance: 0,
      ethBalance: 0,
      amount: '',
      reward: '',
    }
  }

  handleTextRef = ref => this.text = ref;

  componentDidMount() {
    this.setState({publicAddress: getPubKey()});
    getBalance('0xf74694642a81a226771981cd38df9105a133c111').then(bal => this.setState({ethBalance: bal}));
    getTenzBalance().then(tenzBalance => this.setState({ tenzBalance }));
  }

  _navigateToWebView = (uri) => {
    uri = uri || '0x08b79a6a11624e666d21420e9a2bdcdbf9ecfb43b4537e346bf8b35530f0750e';
    this.setState({ buttonState: 'upload' });
    navigate('WebView', {uri: 'https://ropsten.etherscan.io/search?q='+uri})
    this.props.modalControl();
  };

  _sendTransaction = async () => {
    // const {reward, amount, currentCrypto} = this.state;
    const {reward, amount, currentCrypto, publicAddress} = this.state;

    let payload;
    Keyboard.dismiss();
    try {
      if (currentCrypto.type === "token") {
        if (reward) {
          payload = await transferTokensWithTokenReward(currentCrypto.address, web3.utils.toWei(amount, "ether"), publicAddress, web3.utils.toWei(reward, "ether"));
          console.log('PAYLOAD: ', payload);
        } else {
          payload = await transferTokensNoReward(currentCrypto.address, web3.utils.toWei(amount, "ether"), publicAddress);
          console.log('PAYLOAD: ', payload);
        }
      } else if (currentCrypto.type === "cryptoCurrency") {
        if (reward) {
          payload = await transferEtherWithEtherReward(web3.utils.toWei(amount, "ether"), publicAddress, web3.utils.toWei(reward, "ether"));
          console.log('PAYLOAD: ', payload);
        } else {
          payload = await transferEtherNoReward(web3.utils.toWei(amount, "ether"), publicAddress);
          console.log('PAYLOAD: ', payload);
        }
      } else {
        console.log("set currency")
      }
      const res = await fetch('https://tenz-tsn-js-isochfcikf.now.sh/execute/0xf74694642a81a226771981cd38df9105a133c111', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: payload
      });
      const response = JSON.parse(await res.text());
      if (response.txHash) {
        console.log('TXHASH: ', response);
        this.setState({ buttonState: 'success' })
        Alert.alert(
          'Transaction Submitted',
          'View on etherscan?',
          [
            {text: 'View', onPress: () => this._navigateToWebView(response.txHash)},
            {text: 'Close', onPress: () => this.props.modalControl(), style: 'cancel'},
          ],
          { cancelable: false }
        )
      }
      console.log('RESPONSE: ', response.txHash);
      return response;

    } catch(e) {
      this.setState({ buttonState: 'upload' })
      console.log("Unable to make token transfer with no reward")
    }
  };

  _resolveAddress = async (ensUsername) => {
    const {publicAddress} = this.state;
    this.setState({addressChecked: true});
    if (ensUsername.length === 0) {
      this.setState({ensAvailable: false, ensMessage: 'Enter a valid or unempty username'});
      return;
    }

    this.setState({ensDomain: ensUsername});
    const {ensDomain} = this.state;
    const addr = await addressResolver(ensUsername);
    this.setState({publicAddress: addr});

    if (addr === emptyAddress) {
      this.setState({ensAvailable: false, ensMessage: 'Invalid address'});
    } else if(addr === publicAddress) {
      this.setState({ensAvailable: true, ensMessage: "It's your domain!"});
    } else {
      this.setState({ensAvailable: true, ensMessage: "Valid address: " + this.state.publicAddress});
    }
    return addr;
  };

  _chooseBalance = (crypto) => {
    switch(crypto) {
      case "Tenzorum":
        return this.state.tenzBalance;
      case "Ethereum":
        return this.state.ethBalance;
      default:
        return;
    }
  };

  _addressScan =  async (address) => {
    const resolve = await this._resolveAddress(address);
    if (resolve) this.setState({publicAddress: address, ensDomain: address});
  }

  render() {
    const { ensDomain, ensAvailable, ensMessage, cameraModalVisible, qrModalVisible, reward, amount } = this.state;
    const { isVisible } = this.props;
    return (
      <TouchableWithoutFeedback>
        <Modal isVisible={isVisible}>
          <KeyboardAvoidingView behavior="position">
            <View style={styles.closeButtonContainer}>
              <TouchableOpacity style={styles.button} onPress={this.props.modalControl}>
                <FeatherIcon name="x" size={25} color="white"/>
              </TouchableOpacity>
            </View>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.transactionBox}>
                <ScrollView style={{marginRight: -20, marginLeft: -20, height: 100, padding: 10, flex: 0}} horizontal showsHorizontalScrollIndicator={false}>
                  {cryptoCurrencies.map((currency, key) => {
                    let amount = this._chooseBalance(currency.name);
                    const {imageUrl, balance} = currency;
                    let selectStyle = this.state.selected === key ? {backgroundColor: '#cbc7ef'} : {};
                    return (<TouchableOpacity key={key} style={[styles.cryptoBox, selectStyle]} onPress={() => this.setState({currentCrypto: currency, selected: key})}>
                      <Text style={{fontWeight: '700', fontSize: 20, color:'black'}}>{amount || balance}</Text>
                      <Text style={{fontWeight: '700',}}>{currency.symbol}</Text>
                      <Image style={{ width: 40, height: 40, resizeMode:'contain'}} source={imageUrl} />
                    </TouchableOpacity>)
                  })}
                </ScrollView>
                <Animatable.Text ref={this.handleTextRef} style={{fontSize: 20, fontWeight: '700', margin: 5}}>{this.state.currentCrypto.name}</Animatable.Text>
                <View style={styles.inputAndButton}>
                  <Input placeholder="Send to..." onChangeText={this._resolveAddress} autoCapitalize="none" value={ensDomain}/>
                  <TouchableOpacity onPress={() => this.setState({cameraModalVisible: !cameraModalVisible})} style={styles.squareButton}>
                    <MaterialCommIcon name="camera" color="rgba(0,0,0,0.5)" size={20}/>
                  </TouchableOpacity>
                </View>
                <View style={{padding: 5, marginTop: 5, marginBottom: 5, justifyContent: 'center', height: 30, width: width-60, backgroundColor: this.state.addressChecked ? (ensAvailable ? '#ccffca' : '#ee9c9d') : '#bedfff', borderRadius: 8}}>
                  <Text style={{marginTop: 10, height: 25,color: this.state.addressChecked ? (ensAvailable ? 'green' : 'red') : 'blue',}} numberOfLines={1}>
                    {ensMessage}
                  </Text>
                </View>
                <View style={[styles.inputAndButton]}>
                  <Input placeholder="Amount" keyboardType={"numeric"} onChangeText={(amount) => this.setState({amount})} autoCapitalize="none" value={amount}/>
                </View>
                <View style={{width: 5, height: 15}}></View>
                {/*<View style={[styles.inputAndButton, {marginTop: 5}]}>*/}
                  {/*/!*<RangeSlider values={[1]} min={0} max={100000000} step={1000} style={{width: 265}} onValuesChange={(val) => {this.setState({reward: val[0].toString()}); console.log('Value: ', val)}} />*!/*/}
                  {/*<Input placeholder="Reward" keyboardType={"numeric"} onChangeText={(reward) => this.setState({reward})} autoCapitalize="none" value={reward}/>*/}
                {/*</View>*/}
                <RoundButton
                  style={{...shadow}}
                  buttonState={this.state.buttonState} // "upload" or "uploading"
                  buttonStyle={{borderRadius: 10, height: 45, marginTop: 5}}
                  gradientStart={{ x: 0.5, y: 1 }}
                  gradientEnd={{ x: 1, y: 1 }}
                  states={{
                    upload: {
                      text: 'Send',
                      backgroundColors: ['#8785f0', '#5753b1'],
                      // image: require('../../public/Tenz_logo.png'),
                      onPress: () => {
                        if (this.state.currentCrypto.name !== "Select Currency") {
                          this._sendTransaction()
                          this.setState({ buttonState: 'uploading' });
                        } else {
                          this.text.shake();
                        }
                      },
                    },
                    uploading: {
                      text: 'Sending...',
                      gradientStart: { x: 0.8, y: 1 },
                      gradientEnd: { x: 1, y: 1 },
                      backgroundColors: ['#ff0073', '#ff4949'],
                      spinner: true,
                      onPress: () => {
                        // this.imageUploader.cancelUpload();
                        this.setState({ buttonState: 'upload' });
                      },
                    },
                    success: {
                      text: 'Sent',
                      backgroundColors: ['#63c95a', '#12b505'],
                      // image: require('../../public/Tenz_logo.png'),
                      onPress: () => {
                        this.setState({ buttonState: 'upload' });
                      },
                    },

                  }}
                >
                  <Text>Hello</Text>
                </RoundButton>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
          <CameraModal isVisible={cameraModalVisible} modalControl={() => this.setState({cameraModalVisible: false})} addressScan={this._addressScan}/>
        </Modal>
      </TouchableWithoutFeedback>
    )
  }
}


const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: color.component,
    borderRadius: 10,
    height: 160,
    padding: 20,
    width: width - 40,
  },
  closeButtonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: width-50,
    height: 60,
  },
  button: {
    height: 40,
    width: 40,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
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
    alignItems: 'center',
    justifyContent: 'space-around',
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
    flexDirection: 'row',
    width: 265,
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
    ...shadow
  },
  transactionBox: {
    width: width - 40,
    height: 410,
    padding: 10,
    borderRadius: 15,
    backgroundColor: 'white',
    ...shadow
  },
});
