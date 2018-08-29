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
import FeatherIcon from "react-native-vector-icons/Feather";
import {checkSubdomainOwner, newSubdomain} from "../../utils/ensFunctions";
import {loadAccounts} from "../util/db";
import DrawerView from "../App/DrawerView";
import EntypoIcon from "react-native-vector-icons/Entypo";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import Input from "../App/Input";
import {color, text} from "../../utils/themes";

let {height, width} = Dimensions.get('window');

type Props = {};
export default class Button extends Component<Props> {
  constructor(props) {
    super(props);

    this.state= {

    }
  };

  componentDidMount() {

  }

  render() {
    const { disabled, children, onPress } = this.props;
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <View style={styles.button}>
          <View style={[styles.button, disabled ? styles.disabledButton : styles.enabledButton]}>
            {children}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}


const styles = StyleSheet.create({
  mainContainer: {
    width: width - 40,
    height: 100,
    backgroundColor: color.component,
    borderRadius: 10,
  },
  button: {
    width: 100,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center'
  },
  disabledButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderColor: '#aaa',
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: 'black',
    shadowRadius: 1,
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 0
    },
  },
    enabledButton: {
      flex: 1,
      shadowColor: 'black',
      shadowRadius: 1,
      shadowOpacity: 0.5,
      shadowOffset: {
        width: 0,
        height: 0
      },
      backgroundColor: '#317aee',
  }
});
