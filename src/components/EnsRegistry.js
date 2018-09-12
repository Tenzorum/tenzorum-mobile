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

let {height, width} = Dimensions.get('window');

type Props = {};
export default class EnsRegistry extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      ensDomain: '',
      ensAvailable: false,
      publicAddress: '',
      ensMessage: ''
    }
  }

  componentDidMount() {
    // const accounts = loadAccounts();
    // console.log('ACCOUNTS: ', accounts)
  }

  _checkENS = async (ensUsername) => {
    if (ensUsername.length === 0) {
      this.setState({ensAvailable: false, ensMessage: 'Enter a valid or unempty username'});
      return;
    }

    this.setState({ensDomain: ensUsername});
    const {ensDomain} = this.state;
    const addr = await checkSubdomainOwner(ensUsername, 'tenz-id');

    if (addr === emptyAddress) {
      this.setState({ensAvailable: true, ensMessage: 'ENS username available'});
    } else if(addr === currentAccount) {
      this.setState({ensAvailable: true, ensMessage: "It's your domain! Edit away!"});
    } else {
      this.setState({ensAvailable: false, ensMessage: "Oops! It's already taken by: " + addr});
    }

  };

  _setENS = () => {
    const {ensDomain} = this.state;
    newSubdomain(ensDomain, 'tenz-id', '0x37386A1c592Ad2f1CafFdc929805aF78C71b1CE7', '0x37386A1c592Ad2f1CafFdc929805aF78C71b1CE7');
    this.props.onRegister(ensDomain);
  };

  render() {
    const { ensDomain, ensAvailable, ensMessage } = this.state;
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
          <Text style={{marginTop: 10, height: 25, color: ensAvailable ? 'green' : 'red'}} numberOfLines={1}>
            {ensMessage}
          </Text>
          <Button onPress={this._setENS} disabled={!ensAvailable}><Text style={{color: 'white', fontWeight: '900', fontSize: 15}}>Get</Text></Button>
        </View>
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
