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

let {height, width} = Dimensions.get('window');

type Props = {};
export default class EnsRegistry extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      ensDomain: '',
      ensAvailable: false,
      publicAddress: '',
    }
  }

  componentDidMount() {
    const accounts = loadAccounts();
    console.log('ACCOUNTS: ', accounts)
  }

  componentDidUpdate() {
    // this._checkENS();
  }



  _checkENS = async (ensUsername) => {
    if (ensUsername.length === 0) {
      this.setState({ensAvailable: false, ensMessage: 'Enter a valid or unempty username'});
      return;
    }
    console.log('the letter to check', ensUsername)
    const {ensDomain} = this.state;
    const addr = await checkSubdomainOwner(ensUsername, 'tenz-id');
    console.log('DOMAIN check result: ', addr);
    this.setState({ensDomain: ensUsername});

    if (addr === emptyAddress) {
      console.log("It's available! Go for it tiger!");
      this.setState({ensAvailable: true, ensMessage: 'ENS username available'});
    } else if(addr === currentAccount) {
      this.setState({ensAvailable: true, ensMessage: "It's your domain! Edit away!"});
    } else {
      console.log("Oops! It's already taken by: " + addr);
      this.setState({ensAvailable: false, ensMessage: "Oops! It's already taken by: " + addr});
    }

  };

  _setENS = () => {
    const {ensDomain} = this.state;
    newSubdomain(ensDomain, 'tenz-id.eth', '0x37386A1c592Ad2f1CafFdc929805aF78C71b1CE7', '0x37386A1c592Ad2f1CafFdc929805aF78C71b1CE7');
  };

  render() {
    const { ensDomain, ensAvailable, ensMessage } = this.state;
    const { isVisible } = this.props;
    return (
      <Modal isVisible={isVisible}>
        <View style={styles.mainContainer}>
          <Input onChangeText={this._checkENS} value={this.state.ensDomain} autoCapitalize="none"/>
          <Text style={{marginTop: 10, height: 25, color: ensAvailable ? 'green' : 'red'}}>
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
  button: {

  }
});
