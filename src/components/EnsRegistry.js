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

//TODO: Use trim for checking addresses

import Modal from 'react-native-modal';
import Input from "../App/Input";
import {color} from "../../utils/themes";
import Button from "./Button";
import * as Animatable from "react-native-animatable";
import {checkSubdomainOwner, newSubdomain} from "../../utils/ensFunctions";
import {loadAccounts} from "../util/db";
const emptyAddress = '0x0000000000000000000000000000000000000000';
const currentAccount = "0x37386A1c592Ad2f1CafFdc929805aF78C71b1CE7";
import FeatherIcon from 'react-native-vector-icons/Feather'
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import {getBalance, getTenzBalance} from "../../utils/ether";
import {checkAccess} from 'tenzorum'
import {text, shadow} from "../App/themes";

let publicAddress = "0x9E48c4A74D618a567CD657579B728774f35B82C5";


let {height, width} = Dimensions.get('window');

type Props = {};
export default class EnsRegistry extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      ensDomain: '',
      ensFound: false,
      publicAddress: '',
      ensMessage: '',
      ethBalance: 0,
      tenzBalance: 0,
      hasAccess: false,
    }
  }

  componentDidMount() {
    // const accounts = loadAccounts();
    // console.log('ACCOUNTS: ', accounts)
  }

  _checkENS = async (ensUsername) => {
    if (ensUsername.length === 0) {
      this.setState({ensFound: false, ensMessage: 'Enter a valid or unempty username'});
      return;
    }

    this.setState({ensDomain: ensUsername});
    const {ensDomain} = this.state;

    const addr = await checkSubdomainOwner(ensUsername, 'tenz-id');

    if (addr === emptyAddress) {
      this.setState({ensFound: false, ensMessage: 'Unclaimed ENS'});
    } else if(addr === currentAccount) {
      this.setState({ensFound: true, ensMessage: "It's your domain! Edit away!"});
    } else if (addr === "0x") {

    } else {
      this.setState({ensFound: true, ensMessage: "Resolves to: " + addr});
      this._checkBalances(addr);
    }
  };

  _checkBalances = (address) => {
    checkAccess(publicAddress, address).then(access => this.setState({ hasAccess: access}));
    getBalance(address).then(balance => this.setState({ ethBalance: balance }))
    getTenzBalance(address).then(balance => this.setState({ tenzBalance: balance }))
  };

  _setENS = () => {
    const {ensDomain} = this.state;
    // newSubdomain(ensDomain, 'tenz-id', 'xyz', '0x37386A1c592Ad2f1CafFdc929805aF78C71b1CE7', '0x37386A1c592Ad2f1CafFdc929805aF78C71b1CE7');
    this.props.onRegister(ensDomain);
  };

  render() {
    const { ensDomain, ensFound, ensMessage } = this.state;
    const { isVisible } = this.props;
    return (
      <Modal isVisible={isVisible}>
        <View style={styles.closeButtonContainer}>
          <TouchableOpacity style={styles.button} onPress={this.props.toggleFunction}>
            <FeatherIcon name="x" size={25} color="white"/>
          </TouchableOpacity>
        </View>
        <View style={styles.mainContainer}>
          <Input onChangeText={this._checkENS} value={this.state.ensDomain} autoCapitalize="none"/>
          <Text style={{marginTop: 10, height: 25, color: ensFound ? 'green' : 'red'}} numberOfLines={1}>
            {ensMessage}
          </Text>
          <Button onPress={this._setENS} disabled={!ensFound}><Text style={{color: 'white', fontWeight: '900', fontSize: 15}}>Set</Text></Button>
        </View>
        { this.state.ensFound &&   <View style={[styles.infoContainer, {marginTop: 10}]}>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                          <Text style={{fontSize: 20, fontWeight: 'bold', color: 'grey'}}>{this.state.ensDomain}</Text>{ this.state.hasAccess ? <MaterialCommIcon name="checkbox-marked" size={20} color="green"/> : <EntypoIcon name="squared-cross" size={20} color="red"/> }
                                        </View>
                                        <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                          <View style={{flex: 1, padding: 10,}}>
                                            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'grey'}}>ETH</Text>
                                            <Text style={{fontSize: 25, color: 'grey'}}>{this.state.ethBalance.toString()}</Text>
                                          </View>
                                          <View style={{flex: 1, borderLeftWidth: 1, padding: 10, borderLeftColor: 'grey'}}>
                                            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'grey'}}>TENZ</Text>
                                            <Text style={{fontSize: 25, color: 'grey'}}>{this.state.tenzBalance.toString()}</Text>
                                          </View>
                                          <View style={{flex: 1, borderLeftWidth: 1, padding: 10, borderLeftColor: 'grey'}}>
                                            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'grey'}}>ALTS</Text>
                                            <Text style={{fontSize: 25, color: 'grey'}}>{0}</Text>
                                          </View>
                                        </View>
                                      </View>

        }
      </Modal>
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
    ...shadow
  },
  infoContainer: {
    backgroundColor: color.component,
    borderRadius: 10,
    height: 130,
    padding: 20,
    width: width - 40,
    ...shadow
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
  }
});
